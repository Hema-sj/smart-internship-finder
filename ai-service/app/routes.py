from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.skill_extractor import extract_skills
from app.services.matcher import compute_match_score, batch_match

router = APIRouter(prefix='/api')


# ─── Request / Response models ───────────────────────────────────────────────

class SkillExtractRequest(BaseModel):
    text: str

class SkillExtractResponse(BaseModel):
    skills: list[str]
    count:  int

class MatchRequest(BaseModel):
    candidate_text: str      # free-form profile / resume text
    internship_text: str     # concatenated title + course + description + skills

class MatchResponse(BaseModel):
    score:   int             # 0–100
    label:   str             # "Excellent" / "Good" / "Fair" / "Low"

class BatchMatchRequest(BaseModel):
    candidate_text: str
    internships:    list[dict]   # each must have at least 'id'

class BatchMatchResponse(BaseModel):
    results: list[dict]


# ─── Routes ──────────────────────────────────────────────────────────────────

@router.get('/health', tags=['Health'])
def service_health():
    return {
        'status':  'ok',
        'service': 'smart-internship-finder-ai',
        'version': '0.2.0',
        'models':  ['tfidf-cosine-matcher', 'keyword-skill-extractor'],
    }


@router.post('/skills/extract', response_model=SkillExtractResponse, tags=['Skills'])
def skills_extract(body: SkillExtractRequest):
    """Extract recognised tech skills from any free-form text (resume, bio, etc.)."""
    if not body.text.strip():
        raise HTTPException(status_code=400, detail='text must not be empty')
    skills = extract_skills(body.text)
    return {'skills': skills, 'count': len(skills)}


@router.post('/match', response_model=MatchResponse, tags=['Matching'])
def match_single(body: MatchRequest):
    """Score how well a candidate profile matches a single internship description."""
    if not body.candidate_text.strip():
        raise HTTPException(status_code=400, detail='candidate_text must not be empty')
    score = compute_match_score(body.candidate_text, body.internship_text)
    if score >= 85:
        label = 'Excellent'
    elif score >= 65:
        label = 'Good'
    elif score >= 40:
        label = 'Fair'
    else:
        label = 'Low'
    return {'score': score, 'label': label}


@router.post('/match/batch', response_model=BatchMatchResponse, tags=['Matching'])
def match_batch(body: BatchMatchRequest):
    """Score a candidate profile against multiple internships and return ranked results."""
    if not body.candidate_text.strip():
        raise HTTPException(status_code=400, detail='candidate_text must not be empty')
    results = batch_match(body.candidate_text, body.internships)
    return {'results': results}
