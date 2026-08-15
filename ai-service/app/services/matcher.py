"""
AI Match scoring service.
Scores how well a candidate profile matches an internship using TF-IDF cosine similarity.
"""
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def compute_match_score(candidate_text: str, internship_text: str) -> int:
    """
    Return an integer match score 0–100 between candidate profile text
    and internship description/skills text.
    """
    if not candidate_text or not internship_text:
        return 0

    docs = [candidate_text.lower(), internship_text.lower()]
    try:
        vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
        tfidf = vectorizer.fit_transform(docs)
        score = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        return min(100, round(float(score) * 100))
    except Exception:
        return 0


def batch_match(candidate_text: str, internships: list[dict]) -> list[dict]:
    """
    Score a candidate against a list of internship dicts.
    Each dict must have at least 'id' and 'description' / 'skills' keys.
    Returns the list sorted by match_score descending.
    """
    results = []
    for item in internships:
        corpus = " ".join([
            item.get("title", ""),
            item.get("course", ""),
            item.get("description", ""),
            " ".join(item.get("skills", [])),
        ])
        score = compute_match_score(candidate_text, corpus)
        results.append({**item, "match_score": score})
    return sorted(results, key=lambda x: x["match_score"], reverse=True)
