"""
Skill-gap matcher — compares student skills against internship required skills.
Produces match %, matched skills, missing skills, and a match level label.
"""
from app.services.skill_extractor import extract_skills, SKILL_TAXONOMY

# ─── Match levels ─────────────────────────────────────────────────────────────
MATCH_LEVELS = [
    (85, "Excellent"),
    (65, "Strong"),
    (40, "Moderate"),
    (0,  "Low"),
]

def get_match_level(score: int) -> str:
    for threshold, label in MATCH_LEVELS:
        if score >= threshold:
            return label
    return "Low"

# ─── Normalise a skill string for fuzzy comparison ───────────────────────────
def _normalise(s: str) -> str:
    return s.lower().strip().replace(".", "").replace("-", " ").replace("_", " ")

# ─── Skill-based match (exact + fuzzy taxonomy match) ────────────────────────
def skill_match(
    student_skills:     list[str],
    required_skills:    list[str],
    candidate_text:     str = "",
) -> dict:
    """
    Compare student skills vs internship required skills.

    Args:
        student_skills:  List of skill strings from resume extraction.
        required_skills: List of skill strings required by the internship.
        candidate_text:  Full resume text (used for broader extraction if student_skills is empty).

    Returns:
        {
          score, level, matched_skills, missing_skills,
          student_skills, required_skills,
          bonus_skills (student has but not required)
        }
    """
    # If no student skills, try extracting from text
    if not student_skills and candidate_text:
        student_skills = extract_skills(candidate_text)

    # Normalise both lists
    student_norm   = {_normalise(s): s for s in student_skills}
    required_norm  = {_normalise(s): s for s in required_skills}

    if not required_norm:
        # No required skills specified — use TF-IDF cosine as fallback
        return {
            "score":         0,
            "level":         "Low",
            "matched_skills": [],
            "missing_skills": [],
            "student_skills": student_skills,
            "required_skills": required_skills,
            "bonus_skills":  [],
            "note":          "No required skills specified for this internship.",
        }

    matched  = []
    missing  = []

    for norm_req, orig_req in required_norm.items():
        if norm_req in student_norm:
            matched.append(orig_req)
        else:
            # Partial match: check if any student skill contains the required skill
            partial = any(
                norm_req in norm_stu or norm_stu in norm_req
                for norm_stu in student_norm
            )
            if partial:
                matched.append(orig_req)
            else:
                missing.append(orig_req)

    bonus = [s for n, s in student_norm.items() if n not in required_norm]

    # Score = matched / required, boosted slightly by bonus skills
    base_score  = len(matched) / len(required_norm) * 100
    bonus_boost = min(10, len(bonus) * 2)  # up to +10 from bonus skills
    score       = min(100, round(base_score + bonus_boost))

    return {
        "score":          score,
        "level":          get_match_level(score),
        "matched_skills": sorted(matched),
        "missing_skills": sorted(missing),
        "student_skills": sorted(student_skills),
        "required_skills":sorted(required_skills),
        "bonus_skills":   sorted(bonus),
    }


# ─── TF-IDF cosine fallback (kept from original) ─────────────────────────────
def compute_match_score(candidate_text: str, internship_text: str) -> int:
    """TF-IDF cosine similarity fallback score 0–100."""
    if not candidate_text or not internship_text:
        return 0
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    try:
        docs = [candidate_text.lower(), internship_text.lower()]
        vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
        tfidf = vectorizer.fit_transform(docs)
        score = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        return min(100, round(float(score) * 100))
    except Exception:
        return 0


def batch_match(candidate_text: str, internships: list[dict]) -> list[dict]:
    """Score a candidate against multiple internships, sorted by score desc."""
    results = []
    student_skills = extract_skills(candidate_text)
    for item in internships:
        required = item.get("skills", [])
        corpus   = " ".join([
            item.get("title", ""), item.get("course", ""),
            item.get("description", ""), " ".join(required),
        ])
        if required:
            result = skill_match(student_skills, required, candidate_text)
            score  = result["score"]
        else:
            score = compute_match_score(candidate_text, corpus)
        results.append({**item, "match_score": score})
    return sorted(results, key=lambda x: x["match_score"], reverse=True)
