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
import Company         from '../models/Company.js';

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
    response.json(resumes);
  } catch (error) { 
    console.error('Get resumes error:', error);
    next(error); 
  }
}

export async function getResumeById(request, response, next) {
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
    response.json(resume);
  } catch (error) { 
    console.error('Get resume by id error:', error);
    next(error); 
  }
}

export async function uploadResume(request, response, next) {
  try {
    const profile = await getProfile(request.user.id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    // For now, just return a placeholder response
    // The full file upload implementation would require multer setup
    response.status(501).json({ message: 'Resume upload not yet implemented in PostgreSQL migration' });
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

export async function generateAIResume(request, response, next) {
  try {
    const profile = await getProfile(request.user.id);
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });

    // Placeholder for AI resume generation
    response.status(501).json({ message: 'AI resume generation not yet implemented in PostgreSQL migration' });
  } catch (error) { 
    console.error('Generate AI resume error:', error);
    next(error); 
  }
}
