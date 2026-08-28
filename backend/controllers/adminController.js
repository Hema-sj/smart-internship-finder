/**
 * Admin controller — Sequelize/PostgreSQL version
 * All routes protected by requireAuth + requireRole('admin')
 */
import { Op } from 'sequelize';
import { User, StudentProfile, Company, Internship, Application, Notification } from '../models/index.js';

// ─── Users ────────────────────────────────────────────────────────────────────

export async function listUsers(request, response, next) {
  try {
    const page   = Math.max(parseInt(request.query.page, 10) || 1, 1);
    const limit  = Math.min(parseInt(request.query.limit, 10) || 20, 100);
    const offset = (page - 1) * limit;
    
    const where = {};
    if (request.query.role) where.role = request.query.role;
    if (request.query.search) {
      where[Op.or] = [
        { name:  { [Op.iLike]: `%${request.query.search}%` } },
        { email: { [Op.iLike]: `%${request.query.search}%` } },
      ];
    }
    
    const { rows: users, count: total } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      offset,
      limit
    });
    
    response.json({ users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
}

export async function getUserById(request, response, next) {
  try {
    const user = await User.findByPk(request.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return response.status(404).json({ message: 'User not found.' });

    const profile = user.role === 'student'
      ? await StudentProfile.findOne({ where: { userId: user.id } })
      : user.role === 'company'
      ? await Company.findOne({ where: { userId: user.id } })
      : null;

    response.json({ user, profile });
  } catch (error) { next(error); }
}

export async function deleteUser(request, response, next) {
  try {
    if (request.params.id === request.user.id.toString()) {
      return response.status(400).json({ message: 'You cannot delete your own account.' });
    }
    const user = await User.findByPk(request.params.id);
    if (!user) return response.status(404).json({ message: 'User not found.' });

    if (user.role === 'student') await StudentProfile.destroy({ where: { userId: user.id } });
    if (user.role === 'company') await Company.destroy({ where: { userId: user.id } });

    await user.destroy();
    response.json({ message: `User "${user.email}" deleted.` });
  } catch (error) { next(error); }
}

// ─── Internships ──────────────────────────────────────────────────────────────

export async function listAllInternships(request, response, next) {
  try {
    const page  = Math.max(parseInt(request.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(request.query.limit, 10) || 20, 100);
    const offset = (page - 1) * limit;
    
    const where = {};
    if (request.query.status) where.status = request.query.status;
    if (request.query.companyId) where.companyId = request.query.companyId;

    const { rows: items, count: total } = await Internship.findAndCountAll({
      where,
      include: [{ 
        model: Company, 
        as: 'company', 
        attributes: ['id', 'companyName', 'logo', 'verified_status'] 
      }],
      order: [['createdAt', 'DESC']],
      offset,
      limit
    });
    
    response.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { 
    console.error('List internships error:', error);
    next(error); 
  }
}

export async function createInternship(request, response, next) {
  try {
    const {
      title, companyId, location, duration, mode, compensationType,
      stipend, certificateType, requiredSkills, description,
      applicationUrl, startingDate, applicationDeadline
    } = request.body;

    if (!title || !companyId || !location || !duration || !applicationUrl) {
      return response.status(400).json({
        message: 'Missing required fields: title, companyId, location, duration, applicationUrl'
      });
    }

    const company = await Company.findByPk(companyId);
    if (!company) return response.status(404).json({ message: 'Company not found.' });

    const internship = await Internship.create({
      title,
      courseRole: title, // Same as title for now
      companyId,
      location,
      duration,
      mode: mode || 'On-site',
      compensationType: compensationType || 'Paid',
      stipend: compensationType === 'Paid' ? (stipend || 0) : 0,
      certificateType: certificateType || 'Soft Copy',
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      description: description || '',
      applicationUrl,
      startingDate: startingDate || new Date(),
      applicationDeadline: applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'Approved', // Must be 'Approved' not 'Open'
      applicationStatus: 'Open'
    });

    // Notify all students
    const students = await User.findAll({ where: { role: 'student' }, attributes: ['id'] });
    const notifications = students.map(student => ({
      userId: student.id,
      title: 'New Internship Posted!',
      message: `${company.companyName} has posted a new internship: ${title}`,
      type: 'new_internship',
      relatedId: internship.id,
      isRead: false
    }));
    
    if (notifications.length > 0) {
      await Notification.bulkCreate(notifications);
    }

    response.status(201).json({
      message: 'Internship created successfully. All students have been notified.',
      internship
    });
  } catch (error) { 
    console.error('Create internship error:', error);
    next(error); 
  }
}

export async function updateInternshipStatus(request, response, next) {
  try {
    const { status } = request.body;
    if (!['Draft', 'Open', 'Closed'].includes(status)) {
      return response.status(400).json({ message: 'Invalid status. Must be Draft, Open, or Closed.' });
    }
    const internship = await Internship.findByPk(request.params.id);
    if (!internship) return response.status(404).json({ message: 'Internship not found.' });
    
    internship.status = status;
    await internship.save();
    response.json(internship);
  } catch (error) { next(error); }
}

export async function deleteInternshipAdmin(request, response, next) {
  try {
    const internship = await Internship.findByPk(request.params.id);
    if (!internship) return response.status(404).json({ message: 'Internship not found.' });
    
    await internship.destroy();
    response.json({ message: 'Internship deleted.' });
  } catch (error) { next(error); }
}

// ─── Companies ────────────────────────────────────────────────────────────────

export async function listAllCompanies(request, response, next) {
  try {
    const page  = Math.max(parseInt(request.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(request.query.limit, 10) || 100, 1000); // Increased limit
    const offset = (page - 1) * limit;
    
    const where = {};
    // Only filter by verified_status if explicitly requested
    if (request.query.verified !== undefined) {
      where.verified_status = request.query.verified === 'true' ? 'approved' : 'pending';
    }
    if (request.query.search) {
      where.companyName = { [Op.iLike]: `%${request.query.search}%` };
    }

    const { rows: companies, count: total } = await Company.findAndCountAll({
      where,
      order: [['companyName', 'ASC']], // Alphabetical order
      offset,
      limit
    });
    
    console.log(`Fetched ${companies.length} companies out of ${total} total`);
    response.json({ companies, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { 
    console.error('List companies error:', error);
    next(error); 
  }
}

export async function getPendingCompanies(request, response, next) {
  try {
    const pendingCompanies = await Company.findAll({
      where: { verified_status: 'pending' },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'createdAt'] }],
      order: [['createdAt', 'DESC']]
    });

    response.json({
      count: pendingCompanies.length,
      companies: pendingCompanies
    });
  } catch (error) { next(error); }
}

export async function verifyCompany(request, response, next) {
  try {
    const { verified } = request.body;
    const newStatus = verified ? 'approved' : 'rejected';
    
    const company = await Company.findByPk(request.params.id);
    if (!company) return response.status(404).json({ message: 'Company not found.' });

    company.verified_status = newStatus;
    await company.save();

    response.json({ message: `Company "${company.companyName}" ${newStatus}.`, company });
  } catch (error) { next(error); }
}

export async function approveCompanyAccess(request, response, next) {
  try {
    const { companyId } = request.params;
    const { message } = request.body;

    const company = await Company.findByPk(companyId, {
      include: [{ model: User, as: 'user', attributes: ['id', 'email', 'name'] }]
    });
    
    if (!company) return response.status(404).json({ message: 'Company not found.' });

    company.verified_status = 'approved';
    await company.save();

    if (company.userId) {
      await Notification.create({
        userId: company.userId,
        title: 'Company Verified!',
        message: message || `Your company "${company.companyName}" has been verified. You can now post internships.`,
        type: 'company_approved',
        isRead: false
      });
    }

    response.json({ message: `Company "${company.companyName}" has been approved.`, company });
  } catch (error) { next(error); }
}

export async function rejectCompanyAccess(request, response, next) {
  try {
    const { companyId } = request.params;
    const { reason } = request.body;

    const company = await Company.findByPk(companyId, {
      include: [{ model: User, as: 'user', attributes: ['id', 'email', 'name'] }]
    });
    
    if (!company) return response.status(404).json({ message: 'Company not found.' });

    if (company.userId) {
      await Notification.create({
        userId: company.userId,
        title: 'Company Verification Rejected',
        message: reason || `Your company "${company.companyName}" verification was rejected.`,
        type: 'company_rejected',
        isRead: false
      });
    }

    company.verified_status = 'rejected';
    await company.save();

    response.json({ message: `Company "${company.companyName}" has been rejected.`, company });
  } catch (error) { next(error); }
}

// ─── Applications ─────────────────────────────────────────────────────────────

export async function listAllApplications(request, response, next) {
  try {
    const page  = Math.max(parseInt(request.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(request.query.limit, 10) || 20, 100);
    const offset = (page - 1) * limit;
    
    const where = {};
    if (request.query.status) where.status = request.query.status;
    if (request.query.companyId) where.companyId = request.query.companyId;

    const { rows: items, count: total } = await Application.findAndCountAll({
      where,
      include: [
        { model: Internship, as: 'internship', attributes: ['id', 'title', 'location'] },
        { model: Company, as: 'company', attributes: ['id', 'companyName'] },
        { 
          model: StudentProfile, as: 'student',
          include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
        }
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit
    });
    
    response.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export async function getDashboardStats(request, response, next) {
  try {
    const [totalUsers, totalStudents, totalCompanies, totalInternships,
           approvedInternships, totalApplications, pendingVerification] = await Promise.all([
      User.count(),
      User.count({ where: { role: 'student' } }),
      User.count({ where: { role: 'company' } }),
      Internship.count(),
      Internship.count({ where: { status: 'Approved' } }),
      Application.count(),
      Company.count({ where: { verified_status: 'pending' } }),
    ]);

    response.json({
      users: { total: totalUsers, students: totalStudents, companies: totalCompanies },
      internships: { total: totalInternships, open: approvedInternships },
      applications: { total: totalApplications },
      companies: { pendingVerification },
    });
  } catch (error) { next(error); }
}

// ─── New Internship Notifications ────────────────────────────────────────────

export async function getNewInternshipNotifications(request, response, next) {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newInternships = await Internship.findAll({
      where: {
        createdAt: { [Op.gte]: sevenDaysAgo },
        status: 'Approved'
      },
      include: [{ model: Company, as: 'company', attributes: ['id', 'companyName', 'logo', 'verified_status'] }],
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    response.json({
      count: newInternships.length,
      internships: newInternships.map(int => ({
        id: int.id,
        title: int.title,
        company: {
          id: int.company?.id,
          name: int.company?.companyName || 'Unknown Company',
          logo: int.company?.logo,
          verified: int.company?.verified_status === 'approved'
        },
        location: int.location,
        compensationType: int.compensationType,
        stipend: int.stipend,
        createdAt: int.createdAt,
        applicationUrl: int.applicationUrl
      }))
    });
  } catch (error) { next(error); }
}
