"""
Resume parser — extracts structured sections from PDF and DOCX files.
Supports: text, skills, education, experience, projects, certifications.
"""
import re
import io
from pathlib import Path

# ─── PDF extraction ───────────────────────────────────────────────────────────
def _extract_pdf(file_bytes: bytes) -> str:
    from pdfminer.high_level import extract_text
    return extract_text(io.BytesIO(file_bytes)) or ""

# ─── DOCX extraction ─────────────────────────────────────────────────────────
def _extract_docx(file_bytes: bytes) -> str:
    from docx import Document
    doc = Document(io.BytesIO(file_bytes))
    return "\n".join(para.text for para in doc.paragraphs)

# ─── Public entry point ───────────────────────────────────────────────────────
def extract_text(file_bytes: bytes, filename: str) -> str:
    """Extract raw text from PDF or DOCX bytes."""
    ext = Path(filename).suffix.lower()
    if ext == ".pdf":
        return _extract_pdf(file_bytes)
    elif ext in (".docx", ".doc"):
        return _extract_docx(file_bytes)
    else:
        # Plain text fallback
        return file_bytes.decode("utf-8", errors="ignore")

# ─── Section splitter ─────────────────────────────────────────────────────────
SECTION_HEADERS = {
    "education":      r"(education|academic|qualification)",
    "experience":     r"(experience|work history|employment|internship)",
    "skills":         r"(skill|technical skill|core competenc)",
    "projects":       r"(project|portfolio|work sample)",
    "certifications": r"(certif|course|award|achievement|license)",
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
            if re.search(pattern, stripped, re.I) and len(stripped) < 60:
                current = section
                matched = True
                break
        if not matched:
            result[current] = result.get(current, "") + "\n" + stripped

    return result

# ─── Education extractor ──────────────────────────────────────────────────────
DEGREE_PATTERN  = re.compile(r"\b(B\.?E|B\.?Tech|M\.?Tech|M\.?E|B\.?Sc|M\.?Sc|MBA|BCA|MCA|B\.?Com|Ph\.?D)\b", re.I)
YEAR_PATTERN    = re.compile(r"\b(20\d{2})\b")

def _parse_education(text: str) -> list[dict]:
    results = []
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        degree = DEGREE_PATTERN.search(line)
        years  = YEAR_PATTERN.findall(line)
        if degree or years:
            results.append({
                "institution": line,
                "degree": degree.group(0).upper() if degree else "",
                "year": int(years[-1]) if years else None,
            })
    return results[:5]  # cap at 5

# ─── Experience extractor ─────────────────────────────────────────────────────
def _parse_experience(text: str) -> list[dict]:
    results = []
    blocks  = re.split(r"\n{2,}", text.strip())
    for block in blocks[:8]:
        lines = [l.strip() for l in block.splitlines() if l.strip()]
        if not lines:
            continue
        results.append({
            "company":     lines[0],
            "role":        lines[1] if len(lines) > 1 else "",
            "description": " ".join(lines[2:]) if len(lines) > 2 else "",
        })
    return results

# ─── Projects extractor ───────────────────────────────────────────────────────
def _parse_projects(text: str) -> list[dict]:
    results = []
    blocks  = re.split(r"\n{2,}", text.strip())
    for block in blocks[:8]:
        lines = [l.strip() for l in block.splitlines() if l.strip()]
        if not lines:
            continue
        url_match = re.search(r"https?://\S+", block)
        results.append({
            "title":       lines[0],
            "description": " ".join(lines[1:3]),
            "url":         url_match.group(0) if url_match else "",
        })
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
        results.append({
            "title":  parts[0].strip(),
            "issuer": parts[1].strip() if len(parts) > 1 else "",
        })
    return results[:10]

# ─── Main parse function ──────────────────────────────────────────────────────
def parse_resume(file_bytes: bytes, filename: str) -> dict:
    """
    Full resume parse pipeline.
    Returns: { text, skills, education, experience, projects, certifications }
    """
    from app.services.skill_extractor import extract_skills

    raw_text = extract_text(file_bytes, filename)
    sections = _split_sections(raw_text)

    # Skills: from dedicated skills section + entire raw text
    skills_text  = sections.get("skills", "") + "\n" + raw_text
    skills       = extract_skills(skills_text)

    return {
        "text":           raw_text,
        "skills":         skills,
        "education":      _parse_education(sections.get("education", raw_text)),
        "experience":     _parse_experience(sections.get("experience", "")),
        "projects":       _parse_projects(sections.get("projects", "")),
        "certifications": _parse_certifications(sections.get("certifications", "")),
        "word_count":     len(raw_text.split()),
        "char_count":     len(raw_text),
    }
