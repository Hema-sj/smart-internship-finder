"""
FastAPI routes for the Smart Internship Finder AI Service.
Endpoints:
  GET  /api/health                — service health
  POST /api/skills/extract        — extract skills from text
  POST /api/resume/analyze        — parse uploaded PDF/DOCX resume
  POST /api/match                 — single internship match score
  POST /api/match/batch           — batch match score
  POST /api/match/skills          — skill-gap match (matched / missing / score)
"""
import io
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel

from app.services.skill_extractor import extract_skills
from app.services.matcher import (
    compute_match_score, batch_match, skill_match, get_match_level
)
from app.services.resume_parser import parse_resume
from app.services.resume_generator import generate_resume_content
from app.services.swot_analyzer import analyze_swot

router = APIRouter(prefix='/api')

# ─── Constants ────────────────────────────────────────────────────────────────
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc"}
MAX_FILE_SIZE_MB   = 5

# ─── Request / Response models ────────────────────────────────────────────────

class SkillExtractRequest(BaseModel):
    text: str

class SkillExtractResponse(BaseModel):
    skills: list[str]
    count:  int

class MatchRequest(BaseModel):
    candidate_text:  str
    internship_text: str

class MatchResponse(BaseModel):
    score: int
    level: str

class BatchMatchRequest(BaseModel):
    candidate_text: str
    internships:    list[dict]

class BatchMatchResponse(BaseModel):
    results: list[dict]

class SkillMatchRequest(BaseModel):
    student_skills:  list[str]
    required_skills: list[str]
    candidate_text:  str = ""

class SkillMatchResponse(BaseModel):
    score:           int
    level:           str
    matched_skills:  list[str]
    missing_skills:  list[str]
    student_skills:  list[str]
    required_skills: list[str]
    bonus_skills:    list[str]

class ResumeGenerateRequest(BaseModel):
    personalInfo:      dict
    summary:           str = ""
    education:         list[dict] = []
    skills:            list[str] = []
    projects:          list[dict] = []
    certifications:    list[dict] = []
    experience:        list[dict] = []
    achievements:      list[str] = []
    interests:         list[str] = []
    preferredRole:     str = ""
    preferredLocation: str = ""

class ResumeGenerateResponse(BaseModel):
    summary:           str
    formattedSections: dict
    suggestions:       dict

class SWOTAnalysisResponse(BaseModel):
    strengths:       list[str]
    weaknesses:      list[str]
    opportunities:   list[str]
    threats:         list[str]
    recommendations: list[dict]
    overall_score:   int
    confidence:      int
    summary:         str

# ─── Routes ───────────────────────────────────────────────────────────────────

@router.get('/health', tags=['Health'])
def service_health():
    return {
        'status':  'ok',
        'service': 'smart-internship-finder-ai',
        'version': '0.3.0',
        'models':  ['resume-parser', 'skill-gap-matcher', 'tfidf-cosine-matcher'],
    }


@router.post('/skills/extract', response_model=SkillExtractResponse, tags=['Skills'])
def skills_extract(body: SkillExtractRequest):
    """Extract recognised tech skills from any free-form text."""
    if not body.text.strip():
        raise HTTPException(status_code=400, detail='text must not be empty')
    skills = extract_skills(body.text)
    return {'skills': skills, 'count': len(skills)}


@router.post('/resume/analyze', tags=['Resume'])
async def analyze_resume(file: UploadFile = File(...)):
    """
    Upload a PDF, DOCX, or image (JPG/PNG) resume.
    Returns: comprehensive structured data including personal info, skills, education, etc.
    """
    # Validate extension
    from pathlib import Path
    ext = Path(file.filename or "").suffix.lower()
    allowed_extensions = {".pdf", ".docx", ".doc", ".jpg", ".jpeg", ".png"}
    
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Upload PDF, DOC, DOCX, JPG, or PNG."
        )

    # Read & size-check
    file_bytes = await file.read()
    size_mb    = len(file_bytes) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({size_mb:.1f} MB). Maximum is {MAX_FILE_SIZE_MB} MB."
        )

    try:
        result = parse_resume(file_bytes, file.filename)
        return {
            "filename":           file.filename,
            "size_bytes":         len(file_bytes),
            "text":               result["text"][:5000],    # truncate for response
            "personalInfo":       result["personalInfo"],
            "summary":            result["summary"],
            "skills":             result["skills"],
            "education":          result["education"],
            "experience":         result["experience"],
            "projects":           result["projects"],
            "certifications":     result["certifications"],
            "achievements":       result["achievements"],
            "interests":          result["interests"],
            "preferredRole":      result.get("preferredRole", ""),
            "preferredLocation":  result.get("preferredLocation", ""),
            "aiConfidenceScore":  result["aiConfidenceScore"],
            "word_count":         result["word_count"],
        }
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse resume: {str(e)}")


# Alias for backward compatibility
@router.post('/resume/parse', tags=['Resume'])
async def parse_resume_endpoint(file: UploadFile = File(...)):
    """Alias for /resume/analyze for backward compatibility."""
    return await analyze_resume(file)


@router.post('/match', response_model=MatchResponse, tags=['Matching'])
def match_single(body: MatchRequest):
    """TF-IDF cosine similarity score between candidate text and internship text."""
    if not body.candidate_text.strip():
        raise HTTPException(status_code=400, detail='candidate_text must not be empty')
    score = compute_match_score(body.candidate_text, body.internship_text)
    return {'score': score, 'level': get_match_level(score)}


@router.post('/match/batch', response_model=BatchMatchResponse, tags=['Matching'])
def match_batch(body: BatchMatchRequest):
    """Score a candidate against multiple internships — sorted by score desc."""
    if not body.candidate_text.strip():
        raise HTTPException(status_code=400, detail='candidate_text must not be empty')
    results = batch_match(body.candidate_text, body.internships)
    return {'results': results}


@router.post('/match/skills', response_model=SkillMatchResponse, tags=['Matching'])
def match_skills(body: SkillMatchRequest):
    """
    Skill-gap analysis.
    Compares student skills against internship required skills.
    Returns: score, level, matched_skills, missing_skills, bonus_skills.
    """
    result = skill_match(
        student_skills=body.student_skills,
        required_skills=body.required_skills,
        candidate_text=body.candidate_text,
    )
    return result


@router.post('/resume/generate', response_model=ResumeGenerateResponse, tags=['Resume'])
def generate_resume(body: ResumeGenerateRequest):
    """
    Generate professional resume content from user-provided data.
    Enhances descriptions, suggests skills, and formats content in ATS-friendly manner.
    Returns: enhanced summary, formatted sections, and suggestions.
    """
    if not body.personalInfo or not body.personalInfo.get("name"):
        raise HTTPException(status_code=400, detail="personalInfo with name is required")
    
    try:
        result = generate_resume_content(body.model_dump())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume generation failed: {str(e)}")


@router.post('/resume/swot', response_model=SWOTAnalysisResponse, tags=['Resume'])
async def analyze_resume_swot(file: UploadFile = File(...)):
    """
    Analyze uploaded resume and generate SWOT analysis.
    Returns: strengths, weaknesses, opportunities, threats, and skill improvement recommendations.
    """
    # Validate extension
    from pathlib import Path
    ext = Path(file.filename or "").suffix.lower()
    allowed_extensions = {".pdf", ".docx", ".doc", ".jpg", ".jpeg", ".png"}
    
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Upload PDF, DOC, DOCX, JPG, or PNG."
        )

    # Read & size-check
    file_bytes = await file.read()
    size_mb    = len(file_bytes) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({size_mb:.1f} MB). Maximum is {MAX_FILE_SIZE_MB} MB."
        )

    try:
        # Parse resume first
        parsed_data = parse_resume(file_bytes, file.filename)
        
        # Generate SWOT analysis
        swot_result = analyze_swot(parsed_data)
        
        return swot_result
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not analyze resume: {str(e)}")


@router.post('/resume/swot-from-data', response_model=SWOTAnalysisResponse, tags=['Resume'])
def analyze_swot_from_data(body: ResumeGenerateRequest):
    """
    Generate SWOT analysis from resume data (without file upload).
    Useful when resume data is already extracted.
    """
    try:
        resume_data = {
            "skills": body.skills,
            "education": body.education,
            "experience": body.experience,
            "projects": body.projects,
            "certifications": body.certifications,
            "achievements": body.achievements,
            "summary": body.summary
        }
        
        swot_result = analyze_swot(resume_data)
        return swot_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SWOT analysis failed: {str(e)}")
