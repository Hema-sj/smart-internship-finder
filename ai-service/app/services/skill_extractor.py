"""
Skill extraction service.
Matches resume/text against a curated skill taxonomy using simple keyword matching.
"""

SKILL_TAXONOMY = {
    # Programming languages
    "Python", "JavaScript", "TypeScript", "Java", "Kotlin", "Go", "Rust", "C++", "C", "C#",
    "Haskell", "Scala", "Swift", "Dart", "R", "MATLAB",
    # Web
    "React", "Next.js", "Vue.js", "Angular", "HTML", "CSS", "Tailwind", "Node.js", "Express",
    "FastAPI", "Django", "Flask", "Spring Boot", "GraphQL", "REST APIs",
    # Data & ML
    "Machine Learning", "Deep Learning", "NLP", "TensorFlow", "PyTorch", "scikit-learn",
    "Pandas", "NumPy", "SQL", "PostgreSQL", "MongoDB", "Redis", "Spark", "Kafka",
    "Data Engineering", "ETL", "Airflow", "dbt", "Tableau", "Power BI",
    # Cloud & DevOps
    "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform", "CI/CD", "GitHub Actions",
    "Linux", "Bash", "Jenkins", "Ansible",
    # Mobile
    "Android", "iOS", "React Native", "Flutter", "Jetpack Compose",
    # Design & Product
    "Figma", "Product Management", "User Research", "A/B Testing", "Agile", "Scrum",
    # Security
    "Cybersecurity", "Penetration Testing", "Network Security", "OWASP",
    # Other
    "Git", "LLMs", "Generative AI", "Prompt Engineering", "Blockchain",
}

def extract_skills(text: str) -> list[str]:
    """Extract skills found in the given text."""
    if not text:
        return []
    text_lower = text.lower()
    found = []
    for skill in SKILL_TAXONOMY:
        if skill.lower() in text_lower:
            found.append(skill)
    return sorted(found)
