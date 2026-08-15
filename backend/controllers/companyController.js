/**
 * Company controller — all endpoints are scoped to the authenticated company user.
 * Companies can only manage their own profile and their own internships/applications.
 */
import Company     from '../models/Company.js';
import Internship  from '../models/Internship.js';
import Application from '../models/Application.js';
import '../models/StudentProfile.js';
import '../models/Skill.js';

// ─── Helper ───────────────────────────────────────────────────────────────────
async function getCompany(userId) {
  return Company.findOne({ userId });
}

// ─── Company Profile ──────────────────────────────────────────────────────────

export async function getMyCompany(request, response, next) {
  try {
    const company = await getCompany(request.user._id);
    if (!company) return response.status(404).json({ message: 'Company profile not found.' });
    response.json(company);
  } catch (error) { next(error); }
}

export async function updateMyCompany(request, response, next) {
  try {
    const allowed = ['name', 'logo', 'description', 'website', 'location', 'industry', 'size', 'founded'];
    const updates = {};
    allowed.forEach((key) => { if (request.body[key] !== undefined) updates[key] = request.body[key]; });

    const company = await Company.findOneAndUpdate(
      { userId: request.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!company) return response.status(404).json({ message: 'Company profile not found.' });
    response.json(company);
  } catch (error) { next(error); }
}

// ─── Internship Management ────────────────────────────────────────────────────

export async function getMyInternships(request, response, next) {
  try {
    const company = await getCompany(request.user._id);
    if (!company) return response.status(404).json({ message: 'Company profile not found.' });

    const page  = Math.max(parseInt(request.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(request.query.limit, 10) || 12, 50);
    const filter = { companyId: company._id };
    if (request.query.status) filter.status = request.query.status;

    const [items, total] = await Promise.all([
      Internship.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Internship.countDocuments(filter),
    ]);
    response.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
}

export async function createInternship(request, response, next) {
  try {
    const company = await getCompany(request.user._id);
    if (!company) return response.status(404).json({ message: 'Company profile not found. Complete your company profile first.' });
    if (!company.verified) return response.status(403).json({ message: 'Your company must be verified by an admin before posting internships.' });

    const internship = await Internship.create({ ...request.body, companyId: company._id, status: 'Open' });
    response.status(201).json(internship);
  } catch (error) { next(error); }
}

export async function updateInternship(request, response, next) {
  try {
    const company = await getCompany(request.user._id);
    if (!company) return response.status(404).json({ message: 'Company profile not found.' });

    const internship = await Internship.findOneAndUpdate(
      { _id: request.params.id, companyId: company._id },
      { $set: request.body },
      { new: true, runValidators: true }
    );
    if (!internship) return response.status(404).json({ message: 'Internship not found or not owned by your company.' });
    response.json(internship);
  } catch (error) { next(error); }
}

export async function deleteInternship(request, response, next) {
  try {
    const company = await getCompany(request.user._id);
    if (!company) return response.status(404).json({ message: 'Company profile not found.' });

    const internship = await Internship.findOneAndDelete({ _id: request.params.id, companyId: company._id });
    if (!internship) return response.status(404).json({ message: 'Internship not found or not owned by your company.' });
    response.json({ message: 'Internship deleted.' });
  } catch (error) { next(error); }
}

// ─── Application Management ───────────────────────────────────────────────────

export async function getInternshipApplications(request, response, next) {
  try {
    const company = await getCompany(request.user._id);
    if (!company) return response.status(404).json({ message: 'Company profile not found.' });

    // Verify internship belongs to this company
    const internship = await Internship.findOne({ _id: request.params.internshipId, companyId: company._id });
    if (!internship) return response.status(404).json({ message: 'Internship not found or not owned by your company.' });

    const applications = await Application.find({ internshipId: internship._id })
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email' } })
      .sort({ createdAt: -1 });
    response.json(applications);
  } catch (error) { next(error); }
}

export async function updateApplicationStatus(request, response, next) {
  try {
    const { status } = request.body;
    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return response.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const company = await getCompany(request.user._id);
    if (!company) return response.status(404).json({ message: 'Company profile not found.' });

    // Verify application belongs to this company's internship
    const application = await Application.findOneAndUpdate(
      { _id: request.params.id, companyId: company._id },
      { status },
      { new: true }
    );
    if (!application) return response.status(404).json({ message: 'Application not found.' });
    response.json(application);
  } catch (error) { next(error); }
}
