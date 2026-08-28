"""
Resume parser — extracts structured sections from PDF, DOCX, and images (with OCR).
Supports: text, skills, education, experience, projects, certifications, personal info, etc.
"""
import re
import io
import json
from pathlib import Path
from typing import Dict, List, Any

# ─── PDF extraction ───────────────────────────────────────────────────────────
def _extract_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF. If no text found, try OCR on PDF images."""
    from pdfminer.high_level import extract_text
    
    text = extract_text(io.BytesIO(file_bytes)) or ""
    
    # If PDF has very little text (< 100 chars), it's likely a scanned image
    if len(text.strip()) < 100:
        print(f"[PDF] Only {len(text)} chars extracted, trying OCR on PDF images...")
        try:
            from pdf2image import convert_from_bytes
            from PIL import Image
            import pytesseract
            import platform
            
            # Set Tesseract path for Windows
            if platform.system() == 'Windows':
                pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
            
            # Convert PDF pages to images
            images = convert_from_bytes(file_bytes, dpi=300)
            ocr_text = ""
            
            for i, image in enumerate(images):
                page_text = pytesseract.image_to_string(image, lang='eng')
                ocr_text += f"\n--- Page {i+1} ---\n{page_text}"
            
            if len(ocr_text.strip()) > len(text.strip()):
                print(f"[PDF OCR] Extracted {len(ocr_text)} characters from {len(images)} pages")
                return ocr_text
        except Exception as e:
            print(f"[PDF OCR] Error: {str(e)}")
    
    return text

# ─── DOCX extraction ─────────────────────────────────────────────────────────
def _extract_docx(file_bytes: bytes) -> str:
    from docx import Document
    doc = Document(io.BytesIO(file_bytes))
    return "\n".join(para.text for para in doc.paragraphs)

# ─── Image OCR extraction ────────────────────────────────────────────────────
def _extract_image_ocr(file_bytes: bytes) -> str:
    """Extract text from image using Tesseract OCR."""
    try:
        from PIL import Image
        import pytesseract
        import platform
        
        # Set Tesseract path for Windows
        if platform.system() == 'Windows':
            pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        
        image = Image.open(io.BytesIO(file_bytes))
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Extract text using OCR
        text = pytesseract.image_to_string(image, lang='eng')
        print(f"[OCR] Extracted {len(text)} characters from image")
        return text
    except Exception as e:
        print(f"[OCR Error] {str(e)}")
        return ""

# ─── Public entry point ───────────────────────────────────────────────────────
def extract_text(file_bytes: bytes, filename: str) -> str:
    """Extract raw text from PDF, DOCX, or image bytes."""
    ext = Path(filename).suffix.lower()
    if ext == ".pdf":
        return _extract_pdf(file_bytes)
    elif ext in (".docx", ".doc"):
        return _extract_docx(file_bytes)
    elif ext in (".jpg", ".jpeg", ".png"):
        return _extract_image_ocr(file_bytes)
    else:
        # Plain text fallback
        return file_bytes.decode("utf-8", errors="ignore")

# ─── Section splitter ─────────────────────────────────────────────────────────
SECTION_HEADERS = {
    "education":      r"(education|academic|qualification)",
    "experience":     r"(experience|work history|employment|internship)",
    "skills":         r"(skill|technical skill|core competenc|proficienc)",
    "projects":       r"(project|portfolio|work sample)",
    "certifications": r"(certif|course|award|achievement|license)",
    "summary":        r"(summary|objective|profile|about|career)",
    "achievements":   r"(achievement|accomplishment|honor|award)",
    "interests":      r"(interest|hobbies|activities|extracurricular)",
}

def _split_sections(text: str) -> dict[str, str]:
    """Split resume text into named sections."""
    lines  = text.splitlines()
    result = {k: "" for k in SECTION_HEADERS}
    result["raw"] = text
    current = "raw"

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        matched = False
        for section, pattern in SECTION_HEADERS.items():
            if re.search(pattern, stripped, re.I) and len(stripped) < 80:
                current = section
                matched = True
                break
        if not matched:
            result[current] = result.get(current, "") + "\n" + stripped

    return result

# ─── Personal info extractor ──────────────────────────────────────────────────
EMAIL_PATTERN = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')
PHONE_PATTERN = re.compile(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}')
LINKEDIN_PATTERN = re.compile(r'linkedin\.com/in/[\w-]+', re.I)
GITHUB_PATTERN = re.compile(r'github\.com/[\w-]+', re.I)

def _extract_personal_info(text: str) -> dict:
    """Extract personal information from resume text."""
    info = {
        "name": "",
        "email": "",
        "phone": "",
        "linkedIn": "",
        "github": "",
        "portfolio": ""
    }
    
    # Email
    email_match = EMAIL_PATTERN.search(text)
    if email_match:
        info["email"] = email_match.group(0)
    
    # Phone
    phone_match = PHONE_PATTERN.search(text)
    if phone_match:
        info["phone"] = phone_match.group(0)
    
    # LinkedIn
    linkedin_match = LINKEDIN_PATTERN.search(text)
    if linkedin_match:
        info["linkedIn"] = "https://" + linkedin_match.group(0)
    
    # GitHub
    github_match = GITHUB_PATTERN.search(text)
    if github_match:
        info["github"] = "https://" + github_match.group(0)
    
    # Name (first non-empty line, typically)
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    if lines:
        # Skip lines with common headers
        for line in lines[:5]:
            if not re.search(r'(resume|curriculum|cv)', line, re.I) and len(line) < 50:
                info["name"] = line
                break
    
    return info

# ─── Education extractor ──────────────────────────────────────────────────────
DEGREE_PATTERN  = re.compile(r"\b(B\.?E|B\.?Tech|M\.?Tech|M\.?E|B\.?Sc|M\.?Sc|MBA|BCA|MCA|B\.?Com|Ph\.?D|Bachelor|Master|Diploma)\b", re.I)
YEAR_PATTERN    = re.compile(r"\b(20\d{2}|19\d{2})\b")
CGPA_PATTERN    = re.compile(r"\b(\d\.\d{1,2})\s*(GPA|CGPA)?", re.I)

def _parse_education(text: str) -> list[dict]:
    results = []
    blocks = re.split(r"\n{2,}", text.strip())
    
    for block in blocks[:5]:
        lines = [l.strip() for l in block.splitlines() if l.strip()]
        if not lines:
            continue
        
        degree_match = DEGREE_PATTERN.search(block)
        years = YEAR_PATTERN.findall(block)
        cgpa_match = CGPA_PATTERN.search(block)
        
        if degree_match or years:
            entry = {
                "institution": lines[0] if lines else "",
                "degree": degree_match.group(0).upper() if degree_match else "",
                "field": "",
                "startYear": int(years[0]) if len(years) > 0 else None,
                "endYear": int(years[-1]) if len(years) > 1 else int(years[0]) if years else None,
                "cgpa": float(cgpa_match.group(1)) if cgpa_match else None,
                "description": " ".join(lines[1:3]) if len(lines) > 1 else ""
            }
            results.append(entry)
    
    return results

# ─── Experience extractor ─────────────────────────────────────────────────────
DATE_RANGE_PATTERN = re.compile(r"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s*[-–to]+\s*(Present|Current|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\w+\s+\d{4})", re.I)

def _parse_experience(text: str) -> list[dict]:
    results = []
    blocks  = re.split(r"\n{2,}", text.strip())
    
    for block in blocks[:8]:
        lines = [l.strip() for l in block.splitlines() if l.strip()]
        if not lines or len(block) < 20:
            continue
        
        date_match = DATE_RANGE_PATTERN.search(block)
        responsibilities = [l for l in lines[2:] if l and len(l) > 10][:5]
        
        entry = {
            "company": lines[0] if lines else "",
            "role": lines[1] if len(lines) > 1 else "",
            "location": "",
            "startDate": "",
            "endDate": "",
            "current": bool(re.search(r"present|current", block, re.I)),
            "description": " ".join(lines[2:4]) if len(lines) > 2 else "",
            "responsibilities": responsibilities
        }
        
        if date_match:
            date_str = date_match.group(0)
            parts = re.split(r'[-–to]+', date_str, maxsplit=1)
            if len(parts) == 2:
                entry["startDate"] = parts[0].strip()
                entry["endDate"] = parts[1].strip()
        
        results.append(entry)
    
    return results

# ─── Projects extractor ───────────────────────────────────────────────────────
URL_PATTERN = re.compile(r'https?://\S+')

def _parse_projects(text: str) -> list[dict]:
    results = []
    blocks  = re.split(r"\n{2,}", text.strip())
    
    for block in blocks[:8]:
        lines = [l.strip() for l in block.splitlines() if l.strip()]
        if not lines or len(block) < 15:
            continue
        
        url_match = URL_PATTERN.search(block)
        tech_match = re.search(r"(tech|tools|stack|language|framework)[:\s]+(.+)", block, re.I)
        
        entry = {
            "title": lines[0],
            "description": " ".join(lines[1:3]) if len(lines) > 1 else "",
            "technologies": tech_match.group(2).split(',') if tech_match else [],
            "url": url_match.group(0) if url_match else "",
            "startDate": "",
            "endDate": ""
        }
        results.append(entry)
    
    return results

# ─── Certifications extractor ────────────────────────────────────────────────
def _parse_certifications(text: str) -> list[dict]:
    results = []
    for line in text.splitlines():
        line = line.strip()
        if not line or len(line) < 5:
            continue
        
        # Try to split "Cert Title — Issuer" or "Cert Title | Issuer"
        parts = re.split(r"[|—–-]", line, maxsplit=1)
        year_match = YEAR_PATTERN.search(line)
        
        entry = {
            "title": parts[0].strip(),
            "issuer": parts[1].strip() if len(parts) > 1 else "",
            "issueDate": year_match.group(0) if year_match else "",
            "credentialId": "",
            "url": ""
        }
        results.append(entry)
    
    return results[:10]

# ─── Achievements extractor ───────────────────────────────────────────────────
def _parse_achievements(text: str) -> list[str]:
    """Extract achievements as bullet points."""
    achievements = []
    for line in text.splitlines():
        line = line.strip()
        if line and len(line) > 10:
            # Remove bullet points
            line = re.sub(r'^[•\-*]\s*', '', line)
            achievements.append(line)
    return achievements[:10]

# ─── Interests extractor ──────────────────────────────────────────────────────
def _parse_interests(text: str) -> list[str]:
    """Extract interests from text."""
    interests = []
    # Split by common delimiters
    items = re.split(r'[,;|•]', text)
    for item in items:
        item = item.strip()
        if item and len(item) < 50:
            interests.append(item)
    return interests[:10]

# ─── Summary extractor ────────────────────────────────────────────────────────
def _extract_summary(text: str) -> str:
    """Extract professional summary/objective."""
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    # Take first 2-3 substantial lines
    summary_lines = [l for l in lines if len(l) > 30][:3]
    return " ".join(summary_lines)

# ─── Main parse function ──────────────────────────────────────────────────────
def parse_resume(file_bytes: bytes, filename: str) -> dict:
    """
    Full resume parse pipeline with enhanced extraction.
    Returns comprehensive structured data from resume.
    """
    from app.services.skill_extractor import extract_skills

    raw_text = extract_text(file_bytes, filename)
    sections = _split_sections(raw_text)

    # Extract personal information
    personal_info = _extract_personal_info(raw_text)

    # Extract summary
    summary = _extract_summary(sections.get("summary", ""))

    # Skills: from dedicated skills section + entire raw text
    skills_text  = sections.get("skills", "") + "\n" + raw_text
    skills       = extract_skills(skills_text)

    # Extract structured sections
    education = _parse_education(sections.get("education", raw_text))
    experience = _parse_experience(sections.get("experience", ""))
    projects = _parse_projects(sections.get("projects", ""))
    certifications = _parse_certifications(sections.get("certifications", ""))
    achievements = _parse_achievements(sections.get("achievements", ""))
    interests = _parse_interests(sections.get("interests", ""))

    # Calculate confidence score (simple heuristic based on extracted data)
    confidence = 0
    if personal_info.get("email"): confidence += 10
    if personal_info.get("phone"): confidence += 10
    if personal_info.get("name"): confidence += 15
    if len(skills) > 0: confidence += 20
    if len(education) > 0: confidence += 15
    if len(experience) > 0: confidence += 15
    if len(projects) > 0: confidence += 10
    if len(certifications) > 0: confidence += 5

    return {
        "text": raw_text,
        "personalInfo": personal_info,
        "summary": summary,
        "skills": skills,
        "education": education,
        "experience": experience,
        "projects": projects,
        "certifications": certifications,
        "achievements": achievements,
        "interests": interests,
        "preferredRole": "",
        "preferredLocation": "",
        "aiConfidenceScore": min(confidence, 100),
        "word_count": len(raw_text.split()),
        "char_count": len(raw_text),
    }

