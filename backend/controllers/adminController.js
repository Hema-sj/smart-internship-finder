/**
 * Admin controller — full management access to all resources.
 * All routes must be protected by requireAuth + requireRole('admin').
 */
import User           from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import Company        from '../models/Company.js';
import Internship     from '../models/Internship.js';
import Application    from '../models/Application.js';
import Notification   from '../models/Notification.js';

// ─── Users ────────────────────────────────────────────────────────────────────

export async function listUsers(request, response, next) {
  try {
    const page   = Math.max(parseInt(request.query.page, 10) || 1, 1);
    const limit  = Math.min(parseInt(request.query.limit, 10) || 20, 100);
    const filter = {};
    if (request.query.role) filter.role = request.query.role;
    if (request.query.search) {
      filter.$or = [
        { name:  new RegExp(request.query.search, 'i') },
        { email: new RegExp(request.query.search, 'i') },
      ];
    }
    const [users, total] = await Promise.all([
      User.find(filter).select('-password').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      User.countDocuments(filter),
    ]);
    response.json({ users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
}

export async function getUserById(request, response, next) {
  try {
    const user = await User.findById(request.params.id).select('-password');
    if (!user) return response.status(404).json({ message: 'User not found.' });

    const profile = user.role === 'student'
      ? await StudentProfile.findOne({ userId: user._id }).populate('skills', 'name')
      : user.role === 'company'
      ? await Company.findOne({ userId: user._id })
      : null;

    response.json({ user, profile });
  } catch (error) { next(error); }
}

export async function deleteUser(request, response, next) {
  try {
    if (request.params.id === request.user._id.toString()) {
      return response.status(400).json({ message: 'You cannot delete your own account.' });
    }
    const user = await User.findByIdAndDelete(request.params.id);
    if (!user) return response.status(404).json({ message: 'User not found.' });

    // Cascade: delete associated profile
    if (user.role === 'student') await StudentProfile.deleteOne({ userId: user._id });
    if (user.role === 'company') await Company.deleteOne({ userId: user._id });

    response.json({ message: `User "${user.email}" deleted.` });
  } catch (error) { next(error); }
}

// ─── Internships ──────────────────────────────────────────────────────────────

export async function listAllInternships(request, response, next) {
  try {
    const page  = Math.max(parseInt(request.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(request.query.limit, 10) || 20, 100);
    const filter = {};
    if (request.query.status) filter.status = request.query.status;
    if (request.query.companyId) filter.companyId = request.query.companyId;

    const [items, total] = await Promise.all([
      Internship.find(filter)
        .populate('companyId', 'name logo verified')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Internship.countDocuments(filter),
    ]);
    response.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
}

export async function updateInternshipStatus(request, response, next) {
  try {
    const { status } = request.body;
    if (!['Draft', 'Open', 'Closed'].includes(status)) {
      return response.status(400).json({ message: 'Invalid status. Must be Draft, Open, or Closed.' });
    }
    const internship = await Internship.findByIdAndUpdate(
      request.params.id, { status }, { new: true }
    );
    if (!internship) return response.status(404).json({ message: 'Internship not found.' });
    response.json(internship);
  } catch (error) { next(error); }
}

export async function deleteInternshipAdmin(request, response, next) {
  try {
    const internship = await Internship.findByIdAndDelete(request.params.id);
    if (!internship) return response.status(404).json({ message: 'Internship not found.' });
    response.json({ message: 'Internship deleted.' });
  } catch (error) { next(error); }
}

// ─── Companies ────────────────────────────────────────────────────────────────

export async function listAllCompanies(request, response, next) {
  try {
    const page  = Math.max(parseInt(request.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(request.query.limit, 10) || 20, 100);
    const filter = {};
    if (request.query.verified !== undefined) filter.verified = request.query.verified === 'true';
    if (request.query.search) filter.name = new RegExp(request.query.search, 'i');

    const [companies, total] = await Promise.all([
      Company.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Company.countDocuments(filter),
    ]);
    response.json({ companies, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
}

export async function verifyCompany(request, response, next) {
  try {
    const { verified } = request.body;
    if (typeof verified !== 'boolean') {
      return response.status(400).json({ message: 'verified must be a boolean.' });
    }
    const company = await Company.findByIdAndUpdate(
      request.params.id, { verified }, { new: true }
    );
    if (!company) return response.status(404).json({ message: 'Company not found.' });

    // Notify the company owner if we have a linked user
    if (company.userId && verified) {
      const profile = await StudentProfile.findOne({ userId: company.userId });
      if (!profile) {
        // Company user — create a targeted notification via a different mechanism
        // (skipping for now since Notification is student-scoped)
      }
    }

    response.json({ message: `Company "${company.name}" ${verified ? 'verified' : 'unverified'}.`, company });
  } catch (error) { next(error); }
}

// ─── Applications ─────────────────────────────────────────────────────────────

export async function listAllApplications(request, response, next) {
  try {
    const page  = Math.max(parseInt(request.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(request.query.limit, 10) || 20, 100);
    const filter = {};
    if (request.query.status) filter.status = request.query.status;
    if (request.query.companyId) filter.companyId = request.query.companyId;

    const [items, total] = await Promise.all([
      Application.find(filter)
        .populate('internshipId', 'title location')
        .populate('companyId', 'name')
        .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email' } })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Application.countDocuments(filter),
    ]);
    response.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export async function getDashboardStats(request, response, next) {
  try {
    const [totalUsers, totalStudents, totalCompanies, totalInternships,
           openInternships, totalApplications, pendingVerification] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'company' }),
      Internship.countDocuments(),
      Internship.countDocuments({ status: 'Open' }),
      Application.countDocuments(),
      Company.countDocuments({ verified: false }),
    ]);

    response.json({
      users: { total: totalUsers, students: totalStudents, companies: totalCompanies },
      internships: { total: totalInternships, open: openInternships },
      applications: { total: totalApplications },
      companies: { pendingVerification },
    });
  } catch (error) { next(error); }
}
