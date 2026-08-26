"""
SWOT Analysis Generator for Student Resumes
Analyzes resume data and generates:
- Strengths: What the student is good at
- Weaknesses: What needs improvement
- Opportunities: Career paths and growth areas
- Threats: Market challenges and competition
- Skill Improvement Recommendations
"""
from typing import Dict, List, Any

def analyze_swot(resume_data: dict) -> dict:
    """
    Generate SWOT analysis from parsed resume data.
    
    Args:
        resume_data: Parsed resume data with skills, education, experience, projects, etc.
    
    Returns:
        {
            "strengths": ["..."],
            "weaknesses": ["..."],
            "opportunities": ["..."],
            "threats": ["..."],
            "recommendations": [{"skill": "...", "reason": "...", "priority": "High/Medium/Low"}],
            "overall_score": 75,
            "confidence": 85
        }
    """
    
    skills = resume_data.get("skills", [])
    education = resume_data.get("education", [])
    experience = resume_data.get("experience", [])
    projects = resume_data.get("projects", [])
    certifications = resume_data.get("certifications", [])
    achievements = resume_data.get("achievements", [])
    
    # Initialize SWOT components
    strengths = []
    weaknesses = []
    opportunities = []
    threats = []
    recommendations = []
    
    # ═══ STRENGTHS ═══════════════════════════════════════════════════════════
    
    # Technical Skills
    technical_skills = [s for s in skills if _is_technical_skill(s)]
    if len(technical_skills) >= 5:
        strengths.append(f"Strong technical skillset with {len(technical_skills)} skills including {', '.join(technical_skills[:3])}")
    elif len(technical_skills) > 0:
        strengths.append(f"Foundational technical skills in {', '.join(technical_skills[:2])}")
    
    # Education
    if education:
        latest_edu = education[0]
        cgpa = latest_edu.get("cgpa")
        if cgpa and cgpa >= 8.0:
            strengths.append(f"Excellent academic performance with {cgpa} CGPA")
        elif cgpa and cgpa >= 7.0:
            strengths.append(f"Strong academic background with {cgpa} CGPA")
        
        degree = latest_edu.get("degree", "")
        if "Tech" in degree or "Engineering" in degree:
            strengths.append("Technical degree provides solid foundation for tech roles")
    
    # Experience
    if len(experience) > 0:
        years = len(experience)
        if years >= 2:
            strengths.append(f"Significant work experience with {years} previous roles")
        else:
            strengths.append("Practical work experience demonstrates initiative")
        
        # Check for internships
        intern_exp = [e for e in experience if "intern" in e.get("role", "").lower()]
        if intern_exp:
            strengths.append(f"Previous internship experience at {len(intern_exp)} organization(s)")
    
    # Projects
    if len(projects) >= 3:
        strengths.append(f"Hands-on project portfolio with {len(projects)} projects")
        # Check for diverse tech stack
        all_tech = []
        for p in projects:
            all_tech.extend(p.get("technologies", []))
        if len(set(all_tech)) >= 5:
            strengths.append("Diverse technology stack across projects")
    
    # Certifications
    if len(certifications) >= 2:
        strengths.append(f"Industry certifications demonstrate continuous learning ({len(certifications)} certificates)")
    
    # Achievements
    if achievements:
        strengths.append(f"Demonstrated excellence through {len(achievements)} notable achievement(s)")
    
    # If no strengths found, add generic ones
    if not strengths:
        strengths.append("Willingness to learn and grow in chosen field")
        if skills:
            strengths.append(f"Basic understanding of {', '.join(skills[:2])}")
    
    # ═══ WEAKNESSES ══════════════════════════════════════════════════════════
    
    # Lack of experience
    if not experience:
        weaknesses.append("No professional work experience listed")
        opportunities.append("Seek internships to gain practical industry exposure")
        recommendations.append({
            "skill": "Professional Experience",
            "reason": "Gain hands-on industry experience through internships",
            "priority": "High",
            "action": "Apply for entry-level internships in your field of interest"
        })
    
    # Limited technical skills
    if len(technical_skills) < 3:
        weaknesses.append("Limited technical skillset for competitive tech roles")
        recommendations.append({
            "skill": "Core Technical Skills",
            "reason": "Expand technical knowledge to improve job prospects",
            "priority": "High",
            "action": "Learn in-demand skills like Python, React, or data analysis"
        })
    
    # Missing key skills for modern roles
    modern_skills = ["React", "Node.js", "Python", "AWS", "Docker", "Git", "REST API", "Database"]
    missing_modern = [s for s in modern_skills if not any(s.lower() in skill.lower() for skill in skills)]
    
    if len(missing_modern) >= 6:
        weaknesses.append("Lack of modern technology stack knowledge")
        top_missing = missing_modern[:3]
        recommendations.append({
            "skill": ", ".join(top_missing),
            "reason": "These are highly demanded skills in current job market",
            "priority": "High",
            "action": f"Take online courses or build projects using {', '.join(top_missing[:2])}"
        })
    
    # No projects
    if not projects:
        weaknesses.append("No projects showcased to demonstrate practical skills")
        opportunities.append("Build personal projects to showcase skills and creativity")
        recommendations.append({
            "skill": "Project Portfolio",
            "reason": "Projects demonstrate practical application of skills",
            "priority": "Medium",
            "action": "Build 2-3 projects and host them on GitHub with documentation"
        })
    
    # No certifications
    if not certifications:
        weaknesses.append("No industry certifications to validate skills")
        recommendations.append({
            "skill": "Professional Certifications",
            "reason": "Certifications add credibility and show commitment to learning",
            "priority": "Medium",
            "action": "Complete relevant online certifications (Coursera, Udemy, AWS, Google)"
        })
    
    # Low CGPA
    if education:
        cgpa = education[0].get("cgpa")
        if cgpa and cgpa < 6.5:
            weaknesses.append("Academic performance below industry expectations")
            opportunities.append("Focus on skill development to compensate for academics")
    
    # Missing soft skills indicators
    if not achievements and len(experience) == 0:
        weaknesses.append("Limited evidence of leadership or teamwork experience")
        recommendations.append({
            "skill": "Soft Skills & Leadership",
            "reason": "Employers value teamwork, communication, and leadership",
            "priority": "Low",
            "action": "Participate in team projects, hackathons, or student organizations"
        })
    
    # ═══ OPPORTUNITIES ═══════════════════════════════════════════════════════
    
    # Career paths based on skills
    if any(s in ["Python", "Data Science", "Machine Learning", "AI"] for s in technical_skills):
        opportunities.append("Growing demand for AI/ML and data science professionals")
        opportunities.append("Pursue advanced courses in data analytics or machine learning")
    
    if any(s in ["React", "JavaScript", "Node.js", "Frontend", "Web"] for s in technical_skills):
        opportunities.append("High demand for web developers and frontend engineers")
        opportunities.append("Specialize in modern frameworks like React, Vue, or Angular")
    
    if any(s in ["AWS", "Azure", "Cloud", "DevOps", "Docker"] for s in technical_skills):
        opportunities.append("Cloud computing skills are highly valued across industries")
        opportunities.append("Get cloud certifications (AWS, Azure, GCP) for better prospects")
    
    # For freshers
    if not experience:
        opportunities.append("Entry-level internships at startups offer fast-paced learning")
        opportunities.append("Open-source contributions can build portfolio and network")
    
    # General opportunities
    opportunities.append("Remote work opportunities expanding globally")
    opportunities.append("Freelancing platforms offer project-based income while learning")
    
    if education:
        opportunities.append("Leverage college placement cell and alumni network for referrals")
    
    # ═══ THREATS ═════════════════════════════════════════════════════════════
    
    threats.append("High competition in entry-level tech roles")
    threats.append("Rapid technology changes require continuous upskilling")
    
    if not experience and len(technical_skills) < 3:
        threats.append("Lack of experience may limit internship opportunities")
    
    if education:
        degree = education[0].get("degree", "")
        if "Tech" not in degree and "Engineering" not in degree and "Computer" not in degree:
            threats.append("Non-technical degree may require additional skill validation")
    
    threats.append("AI automation changing job requirements and skill expectations")
    threats.append("Many candidates with similar qualifications competing for same roles")
    
    # ═══ OVERALL SCORE ═══════════════════════════════════════════════════════
    
    score = 0
    
    # Skills (max 30 points)
    score += min(30, len(technical_skills) * 5)
    
    # Education (max 15 points)
    if education:
        cgpa = education[0].get("cgpa")
        if cgpa:
            score += min(15, int(cgpa * 1.5))
        else:
            score += 10
    
    # Experience (max 25 points)
    score += min(25, len(experience) * 12)
    
    # Projects (max 15 points)
    score += min(15, len(projects) * 5)
    
    # Certifications (max 10 points)
    score += min(10, len(certifications) * 5)
    
    # Achievements (max 5 points)
    score += min(5, len(achievements) * 2)
    
    overall_score = min(100, score)
    
    # Confidence based on data completeness
    data_points = sum([
        1 if skills else 0,
        1 if education else 0,
        1 if experience else 0,
        1 if projects else 0,
        1 if certifications else 0,
        1 if resume_data.get("summary") else 0
    ])
    confidence = min(100, (data_points / 6) * 100)
    
    return {
        "strengths": strengths[:8],  # Limit to top 8
        "weaknesses": weaknesses[:6],  # Limit to top 6
        "opportunities": opportunities[:8],  # Limit to top 8
        "threats": threats[:5],  # Limit to top 5
        "recommendations": recommendations[:10],  # Limit to top 10
        "overall_score": round(overall_score),
        "confidence": round(confidence),
        "summary": _generate_summary(overall_score, len(strengths), len(weaknesses))
    }


def _is_technical_skill(skill: str) -> bool:
    """Check if a skill is technical/programming related."""
    technical_keywords = [
        "python", "java", "javascript", "react", "node", "sql", "aws", "docker",
        "git", "api", "html", "css", "typescript", "mongodb", "postgresql",
        "angular", "vue", "flutter", "kotlin", "swift", "c++", "c#", ".net",
        "django", "flask", "spring", "express", "rest", "graphql", "redis",
        "kubernetes", "jenkins", "ci/cd", "linux", "bash", "cloud", "azure",
        "machine learning", "ai", "data", "analytics", "tensorflow", "pytorch"
    ]
    return any(keyword in skill.lower() for keyword in technical_keywords)


def _generate_summary(score: int, strengths_count: int, weaknesses_count: int) -> str:
    """Generate overall profile summary."""
    if score >= 75:
        return f"Strong candidate profile with {strengths_count} key strengths. Well-prepared for competitive internship opportunities."
    elif score >= 50:
        return f"Decent candidate profile with {strengths_count} strengths and {weaknesses_count} areas for improvement. Good potential with focused skill development."
    else:
        return f"Developing candidate profile. Focus on building {weaknesses_count} identified areas to improve competitiveness."
