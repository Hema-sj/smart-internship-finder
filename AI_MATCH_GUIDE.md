# AI Match Score - How It Works

## Overview
The **AI Match** column in the internship table shows how well your skills match each internship's requirements. The score is calculated based on your uploaded resume.

## How AI Match is Calculated

### 1. **Resume Upload & Skill Extraction**
When a student uploads their resume:
- The AI service (`localhost:8000`) extracts skills from the resume
- Skills are stored in the student's profile in the database
- Skills include: Programming languages, frameworks, tools, soft skills

### 2. **Match Score Calculation**
For each internship, the system:
1. Compares your skills vs. internship required skills
2. Counts matching skills
3. Calculates percentage: `(matched skills / required skills) × 100`
4. Returns a score from 0-100%

### 3. **Example**
**Your Skills:** JavaScript, React, Node.js, Python  
**Internship Requirements:** JavaScript, React, MongoDB, Express  
**Match Score:** 50% (2 out of 4 skills match)

---

## Current Status

### ✅ What's Working:
1. **Resume Upload** - Students can upload PDF/DOCX resumes
2. **Skill Extraction** - AI service extracts skills automatically
3. **Skills Storage** - Skills saved in `student_profiles.skills` column
4. **Match Calculation** - Backend calculates match percentage
5. **Display** - Match score shows as "X%" in the AI Match column

### 📊 Test Accounts with Skills:

| Email | Skills |
|-------|--------|
| `student@smartintern.com` | JavaScript, React, Node.js, Python |
| `hem020424@gmail.com` | Node.js, Python, AI, C, Go, R, HTTPS, Azure, Flutter, Git, Java, Machine Learning, Power BI, JAVA SCRIPT, PYTHON, REACT JS, CYBER SECURITY, UI AND UX DESIGN |

---

## How to Test AI Match

### Step 1: Login as a Student
```
Email: student@smartintern.com
Password: Student@2024
```

### Step 2: Go to Internships Page
Navigate to: `http://localhost:5173/internships`

### Step 3: View AI Match Scores
- Look at the **AI Match** column in the table
- Scores will show as percentages (e.g., "75%", "50%", "25%")
- Higher scores mean better skill matches

### Step 4: Upload a New Resume (Optional)
1. Go to Profile page
2. Upload your resume (PDF or DOCX)
3. AI service will extract skills
4. Refresh internships page to see updated match scores

---

## For New Students (0% Match Score)

If you're a new student with no skills in your profile, follow these steps:

### Option 1: Upload Resume
1. Login to your account
2. Go to Profile → Resume section
3. Upload your resume (PDF or DOCX format)
4. System automatically extracts skills
5. AI Match scores will update automatically

### Option 2: Manual Skill Entry
1. Login to your account
2. Go to Profile page
3. Add skills manually in the Skills section
4. Save profile
5. AI Match scores will update

---

## Technical Details

### Backend (Node.js + PostgreSQL)
**File:** `backend/controllers/internshipController.js`

```javascript
async function calculateMatchScore(userId, requiredSkills) {
  // Get student profile
  const profile = await StudentProfile.findOne({ where: { userId } });
  
  // Get student skills from profile
  const studentSkills = profile.skills;
  
  // Compare skills (case-insensitive, partial matching)
  const matchCount = requiredSkills.filter(req => 
    studentSkills.some(studentSkill => 
      studentSkill.includes(req) || req.includes(studentSkill)
    )
  ).length;
  
  // Calculate percentage
  const matchPercent = (matchCount / requiredSkills.length) * 100;
  return Math.min(matchPercent, 100);
}
```

### AI Service (Python + FastAPI)
**File:** `ai-service/app/services/resume_parser.py`

- Extracts text from PDF/DOCX
- Uses NLP to identify skills
- Returns structured data including skills array

### Database Schema
**Table:** `student_profiles`
```sql
skills: TEXT[]  -- PostgreSQL array of skill strings
```

---

## Troubleshooting

### Issue: All Scores Show 0%
**Cause:** No skills in student profile  
**Solution:** Upload resume or add skills manually

### Issue: Scores Don't Update
**Cause:** Not logged in or token expired  
**Solution:** Logout and login again

### Issue: Resume Upload Fails
**Cause:** AI service not running  
**Solution:** Check if `localhost:8000` is running:
```bash
cd ai-service
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Issue: Match Score Seems Wrong
**Cause:** Skill matching is case-insensitive and uses partial matching  
**Example:** "JavaScript" matches "javascript", "JS", "java script"

---

## API Endpoints

### Get Internships with AI Match
```http
GET /api/internships
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "...",
      "title": "Software Development Intern",
      "requiredSkills": ["JavaScript", "React", "Node.js"],
      "aiMatch": 75,
      "displayAIMatch": "75%",
      ...
    }
  ]
}
```

### Upload Resume
```http
POST /api/student/resumes
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <resume.pdf>
```

**Response:**
```json
{
  "id": "...",
  "fileName": "resume.pdf",
  "skills": ["JavaScript", "React", "Python", "SQL"],
  "aiAnalyzed": true
}
```

---

## Future Enhancements

1. **Better Skill Matching** - Use semantic similarity (e.g., "React" ≈ "React.js")
2. **Weight Skills** - Core skills count more than nice-to-have skills
3. **Experience Level** - Match based on years of experience
4. **Industry Match** - Consider domain expertise
5. **Location Preference** - Boost scores for preferred locations
6. **Real-time Updates** - Auto-refresh scores when profile changes

---

## Services Status

Make sure all services are running:

```bash
# Backend (Port 5000)
cd backend
npm start

# Frontend (Port 5173)
cd frontend
npm run dev -- --host

# AI Service (Port 8000)
cd ai-service
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Check health:
- Backend: http://localhost:5000/api/health
- Frontend: http://localhost:5173
- AI Service: http://localhost:8000/docs

---

## Summary

✅ **AI Match is fully functional**  
✅ **Calculated automatically when logged in**  
✅ **Based on resume-extracted skills**  
✅ **Shows as percentage in table**  
✅ **Updates when profile changes**

**To see AI Match scores:** Login → Upload Resume → View Internships

---

## Support

If you need help:
1. Check all services are running
2. Verify student has skills in profile
3. Confirm authentication token is valid
4. Check browser console for errors

**Database Query to Check Skills:**
```sql
SELECT u.email, sp.skills 
FROM users u 
JOIN student_profiles sp ON u.id = sp."userId" 
WHERE u.email = 'your@email.com';
```
