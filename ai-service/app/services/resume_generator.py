"""
AI Resume Generator — generates professional resume content from user-provided data.
Uses AI to enhance descriptions, suggest improvements, and format content professionally.
"""
import os
from typing import Dict, List, Any

def generate_professional_summary(personal_info: Dict, summary: str, education: List, skills: List, experience: List, interests: List, preferred_role: str) -> str:
    """Generate or enhance professional summary."""
    if summary and len(summary) > 50:
        return summary
    
    # Build a professional summary from available data
    parts = []
    
    # Role-based intro
    if preferred_role:
        parts.append(f"Motivated professional seeking opportunities in {preferred_role}.")
    elif experience and len(experience) > 0:
        parts.append(f"Experienced {experience[0].get('role', 'professional')} with proven track record.")
    else:
        parts.append("Aspiring professional with strong foundation in technology.")
    
    # Education highlight
    if education and len(education) > 0:
        degree = education[0].get('degree', '')
        if degree:
            parts.append(f"Currently pursuing/completed {degree}.")
    
    # Skills highlight
    if skills and len(skills) >= 3:
        skill_str = ", ".join(skills[:3])
        parts.append(f"Proficient in {skill_str} and related technologies.")
    
    # Career interests
    if interests and len(interests) > 0:
        parts.append(f"Passionate about {', '.join(interests[:2])}.")
    
    return " ".join(parts)


def enhance_project_description(title: str, description: str, technologies: List[str]) -> str:
    """Enhance project description with better professional wording."""
    if not description or len(description) < 20:
        return f"Developed {title} using {', '.join(technologies[:3]) if technologies else 'modern technologies'}."
    
    # Basic enhancement - add action verbs if missing
    action_verbs = ['developed', 'built', 'created', 'designed', 'implemented', 'engineered']
    desc_lower = description.lower()
    
    if not any(verb in desc_lower for verb in action_verbs):
        description = f"Developed and implemented {description}"
    
    return description


def enhance_experience_description(role: str, company: str, description: str, responsibilities: List[str]) -> Dict[str, Any]:
    """Enhance work experience description."""
    enhanced = {
        "description": description,
        "responsibilities": responsibilities or []
    }
    
    if not description and responsibilities:
        # Create description from responsibilities
        enhanced["description"] = f"Worked as {role} at {company}, responsible for {len(responsibilities)} key areas."
    
    # Enhance responsibilities with action verbs
    action_verbs = [
        "Led", "Managed", "Developed", "Implemented", "Designed", "Collaborated",
        "Optimized", "Streamlined", "Coordinated", "Executed", "Facilitated"
    ]
    
    enhanced_responsibilities = []
    for i, resp in enumerate(responsibilities[:6]):
        if not any(resp.strip().startswith(verb) for verb in action_verbs):
            verb = action_verbs[i % len(action_verbs)]
            enhanced_responsibilities.append(f"{verb} {resp.lower()}")
        else:
            enhanced_responsibilities.append(resp)
    
    enhanced["responsibilities"] = enhanced_responsibilities
    return enhanced


def suggest_skills(education: List, projects: List, experience: List, existing_skills: List[str]) -> List[str]:
    """Suggest additional skills based on existing data."""
    suggestions = []
    existing_lower = [s.lower() for s in existing_skills]
    
    # Common skill mappings
    skill_suggestions = {
        "web": ["HTML", "CSS", "JavaScript", "React", "Node.js"],
        "data": ["Python", "SQL", "Pandas", "NumPy", "Data Analysis"],
        "mobile": ["React Native", "Flutter", "Android", "iOS", "Mobile Development"],
        "ai": ["Machine Learning", "TensorFlow", "PyTorch", "Deep Learning", "NLP"],
        "cloud": ["AWS", "Azure", "Docker", "Kubernetes", "DevOps"],
        "backend": ["REST API", "Database Design", "Node.js", "Express", "MongoDB"]
    }
    
    # Check projects and experience for keywords
    all_text = " ".join([
        str(p.get("description", "")) for p in projects
    ] + [
        str(e.get("description", "")) for e in experience
    ]).lower()
    
    for category, skills in skill_suggestions.items():
        if category in all_text:
            for skill in skills:
                if skill.lower() not in existing_lower and skill not in suggestions:
                    suggestions.append(skill)
    
    return suggestions[:5]  # Top 5 suggestions


def format_achievement(achievement: str) -> str:
    """Format achievement with bullet point and action verb."""
    achievement = achievement.strip()
    
    # Remove existing bullet points
    achievement = achievement.lstrip('•-* ')
    
    # Ensure it starts with an action verb or quantifiable result
    action_verbs = ['Achieved', 'Won', 'Secured', 'Awarded', 'Recognized', 'Accomplished']
    
    if not any(achievement.startswith(verb) for verb in action_verbs):
        # Check if it has numbers (quantifiable)
        if any(char.isdigit() for char in achievement[:20]):
            achievement = f"Achieved {achievement.lower()}"
        else:
            achievement = f"Recognized for {achievement.lower()}"
    
    return achievement


def generate_resume_content(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate professional resume content from user-provided data.
    Returns enhanced/formatted sections and suggestions.
    """
    personal_info = data.get("personalInfo", {})
    summary = data.get("summary", "")
    education = data.get("education", [])
    skills = data.get("skills", [])
    projects = data.get("projects", [])
    certifications = data.get("certifications", [])
    experience = data.get("experience", [])
    achievements = data.get("achievements", [])
    interests = data.get("interests", [])
    preferred_role = data.get("preferredRole", "")
    preferred_location = data.get("preferredLocation", "")
    
    # Generate/enhance professional summary
    enhanced_summary = generate_professional_summary(
        personal_info, summary, education, skills, experience, interests, preferred_role
    )
    
    # Enhance projects
    enhanced_projects = []
    for project in projects:
        enhanced_desc = enhance_project_description(
            project.get("title", ""),
            project.get("description", ""),
            project.get("technologies", [])
        )
        enhanced_projects.append({
            **project,
            "description": enhanced_desc
        })
    
    # Enhance experience
    enhanced_experience = []
    for exp in experience:
        enhanced = enhance_experience_description(
            exp.get("role", ""),
            exp.get("company", ""),
            exp.get("description", ""),
            exp.get("responsibilities", [])
        )
        enhanced_experience.append({
            **exp,
            "description": enhanced["description"],
            "responsibilities": enhanced["responsibilities"]
        })
    
    # Format achievements
    formatted_achievements = [format_achievement(a) for a in achievements if a]
    
    # Suggest additional skills
    skill_suggestions = suggest_skills(education, projects, experience, skills)
    
    return {
        "summary": enhanced_summary,
        "formattedSections": {
            "summary": enhanced_summary,
            "projects": enhanced_projects,
            "experience": enhanced_experience,
            "achievements": formatted_achievements
        },
        "suggestions": {
            "skills": skill_suggestions,
            "message": "Consider adding these skills if they apply to your experience."
        }
    }
