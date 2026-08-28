/**
 * Student controller — all endpoints are scoped to the authenticated student.
 * Students can only access their own data (profile, applications, saved, notifications, resumes).
 */
import { 
  StudentProfile, 
  Application, 
  SavedInternship, 
  Notification, 
  Resume, 
  Internship, 
  Company 
} from '../models/index.js';
import { notifyStudentOfMatchingInternships } from '../services/notificationService.js';
import { extractSkillsFromResume } from '../utils/skillExtractor.js';

// ─── Helper ──────────────────────────────────────────────────────────────────
async function getProfile(userId) {
  return StudentProfile.findOne({ where: { userId } });
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function getMyProfile(request, response, next) {
  try {
    const profile = await StudentProfile.findOne({ where: { userId: request.user.id } });
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });
    response.json(profile);
  } catch (error) { 
    console.error('Get profile error:', error);
    next(error); 
  }
}

export async function updateMyProfile(request, response, next) {
  try {
    const allowed = ['phone', 'college', 'degree', 'branch', 'year', 'cgpa',
                     'location', 'skills', 'projects', 'certifications', 'interests', 'dreamCompany'];
    const updates = {};
    allowed.forEach((key) => { if (request.body[key] !== undefined) updates[key] = request.body[key]; });

    const [updated] = await StudentProfile.update(updates, {
      where: { userId: request.user.id },
      returning: true
    });

    if (!updated) return response.status(404).json({ message: 'Profile not found.' });
    
    const profile = await StudentProfile.findOne({ where: { userId: request.user.id } });
    
    // If skills were updated, trigger skill-based notifications
    if (request.body.skills && request.body.skills.length > 0) {
      try {
        await notifyStudentOfMatchingInternships(profile, 50);  // 50% match threshold
        console.log('[Student Profile] Triggered skill-match notifications for student:', profile.id);
      } catch (notifError) {
        console.error('[Student Profile] Failed to create notifications:', notifError);
        // Don't fail the profile update if notifications fail
      }
    }
    
    response.json(profile);
  } catch (error) { 
    console.error('Update profile error:', error);
    next(error); 
  }
}

// ─── Applications ─────────────────────────────────────────────────────────────

export async function getMyApplications(request, response, next) {
  try {
    const profile = await getProfile(request.user.id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const applications = await Application.findAll({
      where: { studentId: profile.id },
      include: [
        {
          model: Internship,
          as: 'internship',
          include: [{ model: Company, as: 'company' }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    response.json(applications);
  } catch (error) { 
    console.error('Get applications error:', error);
    next(error); 
  }
}

export async function applyToInternship(request, response, next) {
  try {
    const { internshipId } = request.body;
    if (!internshipId) return response.status(400).json({ message: 'internshipId is required.' });

    const internship = await Internship.findByPk(internshipId);
    if (!internship) return response.status(404).json({ message: 'Internship not found.' });
    if (internship.status !== 'Open') return response.status(400).json({ message: 'This internship is no longer accepting applications.' });
    if (internship.applicationDeadline < new Date()) return response.status(400).json({ message: 'Application deadline has passed.' });

    const profile = await getProfile(request.user.id);
    if (!profile) return response.status(404).json({ message: 'Student profile not found.' });

    const existing = await Application.findOne({ 
      where: { 
        studentId: profile.id, 
        internshipId 
      } 
    });
    if (existing) return response.status(409).json({ message: 'You have already applied to this internship.' });

    const application = await Application.create({
      studentId:    profile.id,
      internshipId: internship.id,
      status:       'Pending',
      companyId:    internship.companyId,
    });

    // Fire notification
    await Notification.create({
      studentId: profile.id,
      type:      'application',
      title:     'Application Submitted',
      message:   `Your application for "${internship.title}" has been submitted successfully.`,
    });
    response.status(201).json(application);
  } catch (error) { 
    console.error('Apply to internship error:', error);
    next(error); 
  }
}

export async function withdrawApplication(request, response, next) {
  try {
    const profile = await getProfile(request.user.id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const deleted = await Application.destroy({
      where: {
        id: request.params.id,
        studentId: profile.id,
      }
    });
    if (!deleted) return response.status(404).json({ message: 'Application not found.' });
    response.json({ message: 'Application withdrawn successfully.' });
  } catch (error) { 
    console.error('Withdraw application error:', error);
    next(error); 
  }
}

// ─── Saved Internships ────────────────────────────────────────────────────────

export async function getSaved(request, response, next) {
  try {
    const profile = await getProfile(request.user.id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const saved = await SavedInternship.findAll({
      where: { studentId: profile.id },
      include: [
        {
          model: Internship,
          as: 'internship',
          include: [{ model: Company, as: 'company' }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    response.json(saved);
  } catch (error) { 
    console.error('Get saved error:', error);
    next(error); 
  }
}

export async function saveInternship(request, response, next) {
  try {
    const { internshipId } = request.body;
    if (!internshipId) return response.status(400).json({ message: 'internshipId is required.' });

    const profile = await getProfile(request.user.id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const existing = await SavedInternship.findOne({ 
      where: { 
        studentId: profile.id, 
        internshipId 
      } 
    });
    if (existing) return response.status(409).json({ message: 'Already saved.' });

    const saved = await SavedInternship.create({ studentId: profile.id, internshipId });
    response.status(201).json(saved);
  } catch (error) { 
    console.error('Save internship error:', error);
    next(error); 
  }
}

export async function unsaveInternship(request, response, next) {
  try {
    const profile = await getProfile(request.user.id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const deleted = await SavedInternship.destroy({ 
      where: { 
        id: request.params.id, 
        studentId: profile.id 
      } 
    });
    if (!deleted) return response.status(404).json({ message: 'Saved internship not found.' });
    response.json({ message: 'Removed from saved internships.' });
  } catch (error) { 
    console.error('Unsave internship error:', error);
    next(error); 
  }
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function getNotifications(request, response, next) {
  try {
    const profile = await getProfile(request.user.id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const notifications = await Notification.findAll({
      where: { studentId: profile.id },
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    response.json(notifications);
  } catch (error) { 
    console.error('Get notifications error:', error);
    next(error); 
  }
}

export async function markNotificationRead(request, response, next) {
  try {
    const profile = await getProfile(request.user.id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const [updated] = await Notification.update(
      { read: true },
      {
        where: {
          id: request.params.id,
          studentId: profile.id
        }
      }
    );
    
    if (!updated) return response.status(404).json({ message: 'Notification not found.' });
    
    const notification = await Notification.findByPk(request.params.id);
    response.json(notification);
  } catch (error) { 
    console.error('Mark notification read error:', error);
    next(error); 
  }
}

export async function markAllNotificationsRead(request, response, next) {
  try {
    const profile = await getProfile(request.user.id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });
    
    await Notification.update(
      { read: true },
      {
        where: {
          studentId: profile.id,
          read: false
        }
      }
    );
    response.json({ message: 'All notifications marked as read.' });
  } catch (error) { 
    console.error('Mark all notifications read error:', error);
    next(error); 
  }
}

// ─── Resumes ──────────────────────────────────────────────────────────────────

export async function getResumes(request, response, next) {
  try {
    const profile = await getProfile(request.user.id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const resumes = await Resume.findAll({
      where: { studentId: profile.id },
      order: [['uploadedAt', 'DESC']]
    });
    
    // Add _id alias for frontend compatibility
    const resumesWithAlias = resumes.map(r => {
      const data = r.toJSON();
      data._id = data.id;
      return data;
    });
    
    response.json(resumesWithAlias);
  } catch (error) { 
    console.error('Get resumes error:', error);
    next(error); 
  }
}

export async function getResumeById(request, response, next) {
  try {
    console.log('getResumeById called with id:', request.params.id);
    
    if (!request.params.id || request.params.id === 'undefined') {
      return response.status(400).json({ message: 'Invalid resume ID' });
    }
    
    const profile = await getProfile(request.user.id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const resume = await Resume.findOne({ 
      where: { 
        id: request.params.id, 
        studentId: profile.id 
      } 
    });
    if (!resume) return response.status(404).json({ message: 'Resume not found.' });
    
    // Add _id alias for frontend compatibility
    const resumeData = resume.toJSON();
    resumeData._id = resumeData.id;
    
    response.json(resumeData);
  } catch (error) { 
    console.error('Get resume by id error:', error);
    next(error); 
  }
}

export async function uploadResume(request, response, next) {
  try {
    const profile = await getProfile(request.user.id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    if (!request.file) return response.status(400).json({ message: 'No file uploaded.' });

    const file = request.file;
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    
    if (!allowedTypes.includes(file.mimetype)) {
      return response.status(400).json({ message: 'Only PDF, DOC, DOCX, JPG, and PNG files are allowed.' });
    }

    // Maximum file size: 5MB
    if (file.size > 5 * 1024 * 1024) {
      return response.status(400).json({ message: 'File size must not exceed 5MB.' });
    }

    // Call AI service to parse resume
    let extractedData = {
      personalInfo: {},
      skills: [],
      education: [],
      experience: [],
      projects: [],
      certifications: [],
      achievements: [],
      interests: [],
      summary: '',
      text: '',
      aiConfidenceScore: 0
    };

    try {
      const fs = (await import('fs')).default;
      const { Blob } = await import('buffer');
      
      let fileBlob;
      if (file.path && fs.existsSync(file.path)) {
        const fileBuffer = fs.readFileSync(file.path);
        fileBlob = new Blob([fileBuffer], { type: file.mimetype });
      } else if (file.buffer) {
        fileBlob = new Blob([file.buffer], { type: file.mimetype });
      } else {
        throw new Error('No file data available');
      }

      // Use native FormData (Node 18+)
      const formData = new FormData();
      formData.append('file', fileBlob, file.originalname);

      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const aiResponse = await fetch(`${aiServiceUrl}/api/resume/parse`, {
        method: 'POST',
        body: formData,
      });

      if (aiResponse.ok) {
        extractedData = await aiResponse.json();
        console.log(`[AI Service] Successfully extracted ${extractedData.skills?.length || 0} skills`);
        console.log(`[AI Service] Text length: ${extractedData.text?.length || 0} characters`);
        console.log(`[AI Service] Text preview:`, extractedData.text?.substring(0, 200) || 'No text');
      } else {
        const errorText = await aiResponse.text();
        console.warn('[AI Service] Resume parsing failed:', aiResponse.status, errorText);
      }
    } catch (aiError) {
      console.warn('[AI Service] Resume parsing error:', aiError.message);
      // Fallback: Try to extract text and skills manually
      try {
        // Check if file is an image - images require AI service for OCR
        const isImage = file.mimetype.startsWith('image/');
        const isPDF = file.mimetype === 'application/pdf';
        
        if (isImage) {
          console.warn('[Fallback] Image files require AI service for text extraction (OCR)');
          extractedData.text = 'Image file - requires AI service for OCR. Please ensure AI service is running.';
          extractedData.aiConfidenceScore = 0;
          extractedData.skills = [];
        } else if (isPDF) {
          // Try to extract text from PDF using pdf-parse
          try {
            const pdfParse = (await import('pdf-parse')).default;
            const fs = (await import('fs')).default;
            
            let pdfBuffer;
            if (file.path && fs.existsSync(file.path)) {
              pdfBuffer = fs.readFileSync(file.path);
            } else if (file.buffer) {
              pdfBuffer = file.buffer;
            }
            
            if (pdfBuffer) {
              const pdfData = await pdfParse(pdfBuffer);
              const pdfText = pdfData.text;
              
              // Check if PDF has actual text or is just a scanned image
              if (pdfText && pdfText.trim().length > 50) {
                const skills = extractSkillsFromResume(pdfText);
                extractedData.skills = skills;
                extractedData.text = pdfText;
                extractedData.aiConfidenceScore = skills.length > 0 ? 70 : 40;
                console.log(`[Fallback PDF] Extracted ${skills.length} skills from PDF`);
              } else {
                // PDF has no text - it's likely a scanned image, needs OCR
                console.warn('[Fallback PDF] PDF has no readable text - likely a scanned image. OCR required.');
                extractedData.text = 'PDF appears to be a scanned image. Please use a text-based PDF or upload as an image (JPG/PNG) for OCR processing.';
                extractedData.aiConfidenceScore = 0;
                extractedData.skills = [];
              }
            }
          } catch (pdfError) {
            console.warn('[Fallback PDF] Error:', pdfError.message);
          }
        } else {
          // Try to read DOC/DOCX as text
          const fs = (await import('fs')).default;
          let fileText = '';
          
          if (file.path && fs.existsSync(file.path)) {
            fileText = fs.readFileSync(file.path, 'utf-8');
          } else if (file.buffer) {
            fileText = file.buffer.toString('utf-8');
          }
          
          if (fileText && fileText.length > 50) {
            const skills = extractSkillsFromResume(fileText);
            extractedData.skills = skills;
            extractedData.text = fileText;
            extractedData.aiConfidenceScore = skills.length > 0 ? 60 : 30;
            console.log(`[Fallback] Extracted ${skills.length} skills from document`);
          }
        }
      } catch (fallbackError) {
        console.warn('[Fallback] Could not extract text:', fallbackError.message);
      }
    }

    const resume = await Resume.create({
      studentId:          profile.id,
      fileName:           file.originalname,
      fileSize:           file.size,
      filePath:           file.path || '',
      mimeType:           file.mimetype,
      source:             'upload',
      extractedText:      extractedData.text || '',
      personalInfo:       extractedData.personalInfo || {},
      summary:            extractedData.summary || '',
      extractedSkills:    extractedData.skills || [],
      education:          extractedData.education || [],
      experience:         extractedData.experience || [],
      projects:           extractedData.projects || [],
      certifications:     extractedData.certifications || [],
      achievements:       extractedData.achievements || [],
      interests:          extractedData.interests || [],
      preferredRole:      extractedData.preferredRole || '',
      preferredLocation:  extractedData.preferredLocation || '',
      aiAnalyzed:         true,
      aiConfidenceScore:  extractedData.aiConfidenceScore || 0,
    });

    console.log('Resume created successfully:', {
      id: resume.id,
      fileName: resume.fileName,
      studentId: resume.studentId
    });

    // Update student profile with extracted skills
    if (extractedData.skills && extractedData.skills.length > 0) {
      const existingSkills = profile.skills || [];
      const newSkills = [...new Set([...existingSkills, ...extractedData.skills])];
      await StudentProfile.update(
        { skills: newSkills },
        { where: { id: profile.id } }
      );
    }

    // Return the resume as a plain object to ensure all fields are serialized
    const resumeData = resume.toJSON();
    // Add _id alias for frontend compatibility (MongoDB -> PostgreSQL migration)
    resumeData._id = resumeData.id;
    console.log('Returning resume data with id:', resumeData.id);
    response.status(201).json(resumeData);
  } catch (error) { 
    console.error('Upload resume error:', error);
    next(error); 
  }
}

export async function updateResume(request, response, next) {
  try {
    const profile = await getProfile(request.user.id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const allowed = ['fileName', 'summary', 'extractedSkills', 'education', 'projects', 
                     'certifications', 'experience', 'achievements', 'interests'];
    const updates = {};
    allowed.forEach((key) => { if (request.body[key] !== undefined) updates[key] = request.body[key]; });

    const [updated] = await Resume.update(updates, {
      where: {
        id: request.params.id,
        studentId: profile.id
      }
    });

    if (!updated) return response.status(404).json({ message: 'Resume not found.' });
    
    const resume = await Resume.findByPk(request.params.id);
    response.json(resume);
  } catch (error) { 
    console.error('Update resume error:', error);
    next(error); 
  }
}

export async function deleteResume(request, response, next) {
  try {
    const profile = await getProfile(request.user.id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const deleted = await Resume.destroy({
      where: {
        id: request.params.id,
        studentId: profile.id
      }
    });
    if (!deleted) return response.status(404).json({ message: 'Resume not found.' });
    
    response.json({ message: 'Resume deleted successfully.' });
  } catch (error) { 
    console.error('Delete resume error:', error);
    next(error); 
  }
}

export async function getResumeSWOT(request, response, next) {
  try {
    const profile = await getProfile(request.user.id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const resume = await Resume.findOne({
      where: {
        id: request.params.id,
        studentId: profile.id
      }
    });
    
    if (!resume) return response.status(404).json({ message: 'Resume not found.' });

    // Check if SWOT analysis already exists in resume
    if (resume.swotAnalysis) {
      return response.json(resume.swotAnalysis);
    }

    // Call AI service to generate SWOT analysis
    try {
      const resumeData = {
        skills: resume.extractedSkills || [],
        education: resume.education || [],
        experience: resume.experience || [],
        projects: resume.projects || [],
        certifications: resume.certifications || [],
        achievements: resume.achievements || [],
        summary: resume.summary || ''
      };

      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const aiResponse = await fetch(`${aiServiceUrl}/api/resume/swot-from-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalInfo: resume.personalInfo || {},
          summary: resume.summary || '',
          education: resume.education || [],
          skills: resume.extractedSkills || [],
          projects: resume.projects || [],
          certifications: resume.certifications || [],
          experience: resume.experience || [],
          achievements: resume.achievements || [],
          interests: resume.interests || [],
          preferredRole: resume.preferredRole || '',
          preferredLocation: resume.preferredLocation || ''
        }),
      });

      if (aiResponse.ok) {
        const swotData = await aiResponse.json();
        
        // Save SWOT analysis to database
        await Resume.update(
          { swotAnalysis: swotData },
          { where: { id: resume.id } }
        );
        
        return response.json(swotData);
      } else {
        console.warn('[AI Service] SWOT analysis failed with status:', aiResponse.status);
        return response.status(500).json({ message: 'Failed to generate SWOT analysis.' });
      }
    } catch (aiError) {
      console.error('[AI Service] SWOT analysis error:', aiError.message);
      return response.status(500).json({ message: 'AI service unavailable.' });
    }
  } catch (error) {
    console.error('Get resume SWOT error:', error);
    next(error);
  }
}

export async function generateAIResume(request, response, next) {
  try {
    const profile = await getProfile(request.user.id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const {
      personalInfo,
      summary,
      education,
      skills,
      projects,
      certifications,
      experience,
      achievements,
      interests,
      preferredRole,
      preferredLocation
    } = request.body;

    console.log('Generate AI Resume - Received data:', {
      personalInfo,
      skills,
      education: education?.length || 0,
      experience: experience?.length || 0
    });

    // Validate required fields
    if (!personalInfo || !personalInfo.name) {
      return response.status(400).json({ message: 'Personal information with name is required.' });
    }

    // Call AI service to generate professional resume content
    let generatedContent = {
      summary: summary || '',
      formattedSections: {},
      suggestions: {}
    };

    try {
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const aiResponse = await fetch(`${aiServiceUrl}/api/resume/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalInfo,
          summary,
          education,
          skills,
          projects,
          certifications,
          experience,
          achievements,
          interests,
          preferredRole,
          preferredLocation
        }),
      });

      if (aiResponse.ok) {
        generatedContent = await aiResponse.json();
      } else {
        console.warn('[AI Service] Resume generation failed with status:', aiResponse.status);
      }
    } catch (aiError) {
      console.warn('[AI Service] Resume generation error:', aiError.message);
      // Continue with user-provided data
    }

    // Create resume with AI-generated or user-provided content
    const resume = await Resume.create({
      studentId:          profile.id,
      source:             'ai-generated',
      personalInfo:       personalInfo || {},
      summary:            generatedContent.summary || summary || '',
      extractedSkills:    skills || [],
      education:          education || [],
      experience:         experience || [],
      projects:           projects || [],
      certifications:     certifications || [],
      achievements:       achievements || [],
      interests:          interests || [],
      preferredRole:      preferredRole || '',
      preferredLocation:  preferredLocation || '',
      aiAnalyzed:         true,
    });

    console.log('Resume created with skills:', resume.extractedSkills);

    // Update student profile with skills
    if (skills && skills.length > 0) {
      const existingSkills = profile.skills || [];
      const newSkills = [...new Set([...existingSkills, ...skills])];
      console.log('Updating profile with skills:', newSkills);
      await StudentProfile.update(
        { skills: newSkills },
        { where: { id: profile.id } }
      );
    }

    // Add _id alias for frontend compatibility
    const resumeData = resume.toJSON();
    resumeData._id = resumeData.id;

    console.log('Returning resume with extractedSkills:', resumeData.extractedSkills);

    response.status(201).json({
      resume: resumeData,
      generatedContent: generatedContent.formattedSections,
      suggestions: generatedContent.suggestions
    });
  } catch (error) { 
    console.error('Generate AI resume error:', error);
    next(error); 
  }
}


// ─── Skill-Based Notifications ───────────────────────────────────────────────

/**
 * POST /api/students/me/notify-matches
 * Manually trigger skill-based internship matching notifications
 * Useful for testing or when student wants to refresh their matches
 */
export async function triggerSkillNotifications(request, response, next) {
  try {
    const profile = await getProfile(request.user.id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    if (!profile.skills || profile.skills.length === 0) {
      return response.status(400).json({ 
        message: 'Please add skills to your profile first to receive match notifications.' 
      });
    }

    // Trigger notifications
    const result = await notifyStudentOfMatchingInternships(profile, 50);
    
    response.json({
      success: true,
      message: result.message,
      notificationsCreated: result.notified
    });
  } catch (error) {
    console.error('Trigger skill notifications error:', error);
    next(error);
  }
}
