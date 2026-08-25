/**
 * Student controller — all endpoints are scoped to the authenticated student.
 * Students can only access their own data (profile, applications, saved, notifications, resumes).
 */
import StudentProfile  from '../models/StudentProfile.js';
import Application     from '../models/Application.js';
import SavedInternship from '../models/SavedInternship.js';
import Notification    from '../models/Notification.js';
import Resume          from '../models/Resume.js';
import Internship      from '../models/Internship.js';
import '../models/Company.js';
import '../models/Skill.js';

// ─── Helper ──────────────────────────────────────────────────────────────────
async function getProfile(userId) {
  return StudentProfile.findOne({ userId });
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function getMyProfile(request, response, next) {
  try {
    const profile = await StudentProfile.findOne({ userId: request.user._id })
      .populate('skills', 'name');
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });
    response.json(profile);
  } catch (error) { next(error); }
}

export async function updateMyProfile(request, response, next) {
  try {
    const allowed = ['phone', 'college', 'degree', 'branch', 'year', 'cgpa',
                     'location', 'skills', 'projects', 'certifications', 'interests', 'dreamCompany'];
    const updates = {};
    allowed.forEach((key) => { if (request.body[key] !== undefined) updates[key] = request.body[key]; });

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: request.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('skills', 'name');

    if (!profile) return response.status(404).json({ message: 'Profile not found.' });
    response.json(profile);
  } catch (error) { next(error); }
}

// ─── Applications ─────────────────────────────────────────────────────────────

export async function getMyApplications(request, response, next) {
  try {
    const profile = await getProfile(request.user._id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const applications = await Application.find({ studentId: profile._id })
      .populate({ path: 'internshipId', populate: { path: 'companyId', select: 'name logo location' } })
      .sort({ createdAt: -1 });
    response.json(applications);
  } catch (error) { next(error); }
}

export async function applyToInternship(request, response, next) {
  try {
    const { internshipId } = request.body;
    if (!internshipId) return response.status(400).json({ message: 'internshipId is required.' });

    const internship = await Internship.findById(internshipId);
    if (!internship) return response.status(404).json({ message: 'Internship not found.' });
    if (internship.status !== 'Open') return response.status(400).json({ message: 'This internship is no longer accepting applications.' });
    if (internship.applicationDeadline < new Date()) return response.status(400).json({ message: 'Application deadline has passed.' });

    const profile = await getProfile(request.user._id);
    if (!profile) return response.status(404).json({ message: 'Student profile not found.' });

    const existing = await Application.findOne({ studentId: profile._id, internshipId });
    if (existing) return response.status(409).json({ message: 'You have already applied to this internship.' });

    const application = await Application.create({
      studentId:    profile._id,
      internshipId: internship._id,
      companyId:    internship.companyId,
    });

    // Fire notification
    await Notification.create({
      studentId: profile._id,
      title:     'Application Submitted',
      message:   `Your application for "${internship.title}" has been submitted successfully.`,
      type:      'application',
    });

    response.status(201).json(application);
  } catch (error) { next(error); }
}

export async function withdrawApplication(request, response, next) {
  try {
    const profile = await getProfile(request.user._id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const application = await Application.findOneAndDelete({
      _id: request.params.id,
      studentId: profile._id,
    });
    if (!application) return response.status(404).json({ message: 'Application not found.' });
    response.json({ message: 'Application withdrawn successfully.' });
  } catch (error) { next(error); }
}

// ─── Saved Internships ────────────────────────────────────────────────────────

export async function getSaved(request, response, next) {
  try {
    const profile = await getProfile(request.user._id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const saved = await SavedInternship.find({ studentId: profile._id })
      .populate({ path: 'internshipId', populate: { path: 'companyId', select: 'name logo location' } })
      .sort({ savedAt: -1 });
    response.json(saved);
  } catch (error) { next(error); }
}

export async function saveInternship(request, response, next) {
  try {
    const { internshipId } = request.body;
    if (!internshipId) return response.status(400).json({ message: 'internshipId is required.' });

    const profile = await getProfile(request.user._id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const existing = await SavedInternship.findOne({ studentId: profile._id, internshipId });
    if (existing) return response.status(409).json({ message: 'Already saved.' });

    const saved = await SavedInternship.create({ studentId: profile._id, internshipId });
    response.status(201).json(saved);
  } catch (error) { next(error); }
}

export async function unsaveInternship(request, response, next) {
  try {
    const profile = await getProfile(request.user._id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const deleted = await SavedInternship.findOneAndDelete({ _id: request.params.id, studentId: profile._id });
    if (!deleted) return response.status(404).json({ message: 'Saved internship not found.' });
    response.json({ message: 'Removed from saved internships.' });
  } catch (error) { next(error); }
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function getNotifications(request, response, next) {
  try {
    const profile = await getProfile(request.user._id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const notifications = await Notification.find({ studentId: profile._id })
      .sort({ createdAt: -1 })
      .limit(50);
    response.json(notifications);
  } catch (error) { next(error); }
}

export async function markNotificationRead(request, response, next) {
  try {
    const profile = await getProfile(request.user._id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const notification = await Notification.findOneAndUpdate(
      { _id: request.params.id, studentId: profile._id },
      { read: true },
      { new: true }
    );
    if (!notification) return response.status(404).json({ message: 'Notification not found.' });
    response.json(notification);
  } catch (error) { next(error); }
}

export async function markAllNotificationsRead(request, response, next) {
  try {
    const profile = await getProfile(request.user._id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });
    await Notification.updateMany({ studentId: profile._id, read: false }, { read: true });
    response.json({ message: 'All notifications marked as read.' });
  } catch (error) { next(error); }
}

// ─── Resumes ──────────────────────────────────────────────────────────────────

export async function getResumes(request, response, next) {
  try {
    const profile = await getProfile(request.user._id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const resumes = await Resume.find({ studentId: profile._id }).sort({ uploadedAt: -1 });
    response.json(resumes);
  } catch (error) { next(error); }
}

export async function getResumeById(request, response, next) {
  try {
    const profile = await getProfile(request.user._id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const resume = await Resume.findOne({ _id: request.params.id, studentId: profile._id });
    if (!resume) return response.status(404).json({ message: 'Resume not found.' });
    response.json(resume);
  } catch (error) { next(error); }
}

export async function uploadResume(request, response, next) {
  try {
    const profile = await getProfile(request.user._id);
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
      const FormData = (await import('form-data')).default;
      const fs = (await import('fs')).default;
      const formData = new FormData();
      
      // Read file from disk if available, otherwise use buffer
      if (file.path) {
        formData.append('file', fs.createReadStream(file.path), file.originalname);
      } else {
        formData.append('file', file.buffer, { filename: file.originalname });
      }

      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const aiResponse = await fetch(`${aiServiceUrl}/api/resume/parse`, {
        method: 'POST',
        body: formData,
        headers: formData.getHeaders(),
      });

      if (aiResponse.ok) {
        extractedData = await aiResponse.json();
      } else {
        console.warn('[AI Service] Resume parsing failed with status:', aiResponse.status);
      }
    } catch (aiError) {
      console.warn('[AI Service] Resume parsing error:', aiError.message);
      // Continue without AI data — graceful fallback
    }

    const resume = await Resume.create({
      studentId:          profile._id,
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

    // Update student profile with extracted skills
    if (extractedData.skills && extractedData.skills.length > 0) {
      const existingSkills = profile.skills || [];
      const newSkills = [...new Set([...existingSkills, ...extractedData.skills])];
      await StudentProfile.findByIdAndUpdate(profile._id, { skills: newSkills });
    }

    response.status(201).json(resume);
  } catch (error) { next(error); }
}

export async function updateResume(request, response, next) {
  try {
    const profile = await getProfile(request.user._id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const allowed = [
      'personalInfo', 'summary', 'extractedSkills', 'education',
      'experience', 'projects', 'certifications', 'achievements',
      'interests', 'preferredRole', 'preferredLocation'
    ];

    const updates = {};
    allowed.forEach((key) => {
      if (request.body[key] !== undefined) updates[key] = request.body[key];
    });

    const resume = await Resume.findOneAndUpdate(
      { _id: request.params.id, studentId: profile._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!resume) return response.status(404).json({ message: 'Resume not found.' });

    // Update student profile with updated skills
    if (updates.extractedSkills) {
      const existingProfileSkills = profile.skills || [];
      const mergedSkills = [...new Set([...existingProfileSkills, ...updates.extractedSkills])];
      await StudentProfile.findByIdAndUpdate(profile._id, { skills: mergedSkills });
    }

    response.json(resume);
  } catch (error) { next(error); }
}

export async function deleteResume(request, response, next) {
  try {
    const profile = await getProfile(request.user._id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    const resume = await Resume.findOneAndDelete({ _id: request.params.id, studentId: profile._id });
    if (!resume) return response.status(404).json({ message: 'Resume not found.' });

    // Delete physical file if exists
    if (resume.filePath) {
      try {
        const fs = (await import('fs')).default;
        const path = (await import('path')).default;
        const filePath = path.resolve(resume.filePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fileError) {
        console.warn('[File Delete] Error:', fileError.message);
      }
    }

    response.json({ message: 'Resume deleted.' });
  } catch (error) { next(error); }
}

export async function generateAIResume(request, response, next) {
  try {
    const profile = await getProfile(request.user._id);
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
      studentId:          profile._id,
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

    // Update student profile with skills
    if (skills && skills.length > 0) {
      const existingSkills = profile.skills || [];
      const newSkills = [...new Set([...existingSkills, ...skills])];
      await StudentProfile.findByIdAndUpdate(profile._id, { skills: newSkills });
    }

    response.status(201).json({
      resume,
      generatedContent: generatedContent.formattedSections,
      suggestions: generatedContent.suggestions
    });
  } catch (error) { next(error); }
}
