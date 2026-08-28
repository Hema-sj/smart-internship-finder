/**
 * Notification Service
 * Handles skill-based matching notifications for students
 */
import { Op } from 'sequelize';
import { StudentProfile, Notification, Internship, Company } from '../models/index.js';

/**
 * Calculate match percentage between student skills and required skills
 */
function calculateSkillMatch(studentSkills, requiredSkills) {
  if (!studentSkills || !requiredSkills || requiredSkills.length === 0) {
    return 0;
  }

  const studentSkillsLower = studentSkills.map(s => 
    (typeof s === 'string' ? s : s.name || '').toLowerCase()
  );
  const requiredSkillsLower = requiredSkills.map(s => s.toLowerCase());

  const matchCount = requiredSkillsLower.filter(req => 
    studentSkillsLower.some(studentSkill => 
      studentSkill.includes(req) || req.includes(studentSkill)
    )
  ).length;

  return Math.round((matchCount / requiredSkillsLower.length) * 100);
}

/**
 * Create skill-based notifications for a new internship
 * Matches internship requirements with student skills
 * 
 * @param {Object} internship - The newly created internship
 * @param {number} minMatchThreshold - Minimum match percentage (default: 40%)
 */
export async function notifyMatchingStudents(internship, minMatchThreshold = 40) {
  try {
    // Only notify for approved, open internships with required skills
    if (
      internship.status !== 'Approved' || 
      internship.applicationStatus !== 'Open' ||
      !internship.requiredSkills || 
      internship.requiredSkills.length === 0
    ) {
      return { notified: 0, message: 'Internship not eligible for notifications' };
    }

    // Get company details
    const company = await Company.findByPk(internship.companyId);
    if (!company) {
      return { notified: 0, message: 'Company not found' };
    }

    // Find all active student profiles with skills
    const students = await StudentProfile.findAll({
      where: {
        skills: {
          [Op.not]: null,
          [Op.ne]: []  // Not empty array
        }
      }
    });

    if (students.length === 0) {
      return { notified: 0, message: 'No students with skills found' };
    }

    // Match students and create notifications
    const notifications = [];
    let notifiedCount = 0;

    for (const student of students) {
      const matchPercent = calculateSkillMatch(student.skills, internship.requiredSkills);

      // Only notify if match is above threshold
      if (matchPercent >= minMatchThreshold) {
        // Check if notification already exists for this student and internship
        const existingNotification = await Notification.findOne({
          where: {
            studentId: student.id,
            type: 'match',
            message: {
              [Op.like]: `%${internship.id}%`  // Check if internship ID is in message
            }
          }
        });

        if (!existingNotification) {
          notifications.push({
            studentId: student.id,
            title: `${matchPercent}% Match: ${internship.title}`,
            message: `New ${internship.title} opportunity at ${company.companyName} matches ${matchPercent}% of your skills! Location: ${internship.location}. Duration: ${internship.duration}. Compensation: ${internship.compensationType}. Internship ID: ${internship.id}`,
            type: 'match',
            read: false
          });
          notifiedCount++;
        }
      }
    }

    // Bulk create notifications
    if (notifications.length > 0) {
      await Notification.bulkCreate(notifications);
      console.log(`[Notification Service] Created ${notifiedCount} skill-match notifications for internship: ${internship.title}`);
    }

    return { 
      notified: notifiedCount, 
      message: `Notified ${notifiedCount} matching students`,
      internshipTitle: internship.title,
      companyName: company.companyName
    };

  } catch (error) {
    console.error('[Notification Service] Error creating skill-match notifications:', error);
    throw error;
  }
}

/**
 * Create notifications for all existing internships for a new student
 * Called when a student creates/updates their profile with skills
 * 
 * @param {Object} studentProfile - The student profile
 * @param {number} minMatchThreshold - Minimum match percentage (default: 50%)
 */
export async function notifyStudentOfMatchingInternships(studentProfile, minMatchThreshold = 50) {
  try {
    if (!studentProfile.skills || studentProfile.skills.length === 0) {
      return { notified: 0, message: 'Student has no skills' };
    }

    // Find all open, approved internships
    const internships = await Internship.findAll({
      where: {
        status: 'Approved',
        applicationStatus: 'Open',
        requiredSkills: {
          [Op.not]: null,
          [Op.ne]: []
        }
      },
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'companyName']
      }]
    });

    if (internships.length === 0) {
      return { notified: 0, message: 'No internships found' };
    }

    const notifications = [];
    let notifiedCount = 0;

    for (const internship of internships) {
      const matchPercent = calculateSkillMatch(studentProfile.skills, internship.requiredSkills);

      if (matchPercent >= minMatchThreshold) {
        // Check if notification already exists
        const existingNotification = await Notification.findOne({
          where: {
            studentId: studentProfile.id,
            type: 'match',
            message: {
              [Op.like]: `%${internship.id}%`
            }
          }
        });

        if (!existingNotification) {
          notifications.push({
            studentId: studentProfile.id,
            title: `${matchPercent}% Match: ${internship.title}`,
            message: `${internship.title} at ${internship.company.companyName} matches ${matchPercent}% of your skills! Location: ${internship.location}. Duration: ${internship.duration}. Compensation: ${internship.compensationType}. Internship ID: ${internship.id}`,
            type: 'match',
            read: false
          });
          notifiedCount++;
        }
      }
    }

    // Bulk create notifications
    if (notifications.length > 0) {
      await Notification.bulkCreate(notifications);
      console.log(`[Notification Service] Created ${notifiedCount} skill-match notifications for student: ${studentProfile.id}`);
    }

    return { 
      notified: notifiedCount, 
      message: `Found ${notifiedCount} matching internships`
    };

  } catch (error) {
    console.error('[Notification Service] Error finding matching internships:', error);
    throw error;
  }
}

/**
 * Create welcome/system notifications for a new student
 */
export async function createWelcomeNotification(studentProfile) {
  try {
    await Notification.create({
      studentId: studentProfile.id,
      title: 'Welcome to Smart Internship Finder!',
      message: 'Complete your profile and upload your resume to get personalized internship recommendations based on your skills.',
      type: 'system',
      read: false
    });
    console.log(`[Notification Service] Created welcome notification for student: ${studentProfile.id}`);
  } catch (error) {
    console.error('[Notification Service] Error creating welcome notification:', error);
  }
}
