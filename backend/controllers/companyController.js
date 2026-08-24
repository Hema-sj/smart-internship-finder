/**
 * Company controller — all endpoints are scoped to the authenticated company user.
 * Companies can only manage their own profile and their own internships/applications.
 */
import Company     from '../models/Company.js';
import Internship  from '../models/Internship.js';
import Application from '../models/Application.js';
import User        from '../models/User.js';

// ─── Helper ───────────────────────────────────────────────────────────────────
async function getCompany(userId) {
  return Company.findOne({ userId });
}

// ─── Company Profile ──────────────────────────────────────────────────────────

export async function getMyProfile(request, response, next) {
  try {
    const company = await getCompany(request.user._id);
    if (!company) return response.status(404).json({ message: 'Company profile not found.' });
    
    // Return profile excluding sensitive fields
    const profile = company.toJSON();
    response.json(profile);
  } catch (error) { next(error); }
}

export async function updateMyProfile(request, response, next) {
  try {
    const allowed = ['companyName', 'website', 'industry', 'logo', 'description'];
    const updates = {};
    allowed.forEach((key) => { 
      if (request.body[key] !== undefined) updates[key] = request.body[key]; 
    });

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
    const limit = Math.min(parseInt(request.query.limit, 10) || 20, 50);
    
    const filter = { companyId: company._id };
    if (request.query.status) {
      filter.status = request.query.status;
    }

    const [data, totalCount] = await Promise.all([
      Internship.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Internship.countDocuments(filter),
    ]);
    
    const totalPages = Math.ceil(totalCount / limit);
    
    response.json({ 
      data,
      totalCount,
      totalPages,
      currentPage: page
    });
  } catch (error) { next(error); }
}

export async function getMyInternshipById(request, response, next) {
  try {
    const company = await getCompany(request.user._id);
    if (!company) return response.status(404).json({ message: 'Company profile not found.' });

    const internship = await Internship.findOne({ 
      _id: request.params.id, 
      companyId: company._id 
    }).lean();
    
    if (!internship) {
      return response.status(404).json({ message: 'Internship not found or not owned by your company.' });
    }
    
    response.json(internship);
  } catch (error) { next(error); }
}

export async function createInternship(request, response, next) {
  try {
    const company = await getCompany(request.user._id);
    if (!company) {
      return response.status(404).json({ 
        message: 'Company profile not found. Complete your company profile first.' 
      });
    }
    
    // Check if company is verified/approved
    if (company.verified_status !== 'approved') {
      return response.status(403).json({ 
        message: 'Your company must be verified by an admin before posting internships.' 
      });
    }

    // Create internship with status: Pending (requires admin approval)
    const internship = await Internship.create({
      ...request.body,
      companyId: company._id,
      status: 'Pending', // Always starts as Pending
    });
    
    response.status(201).json(internship);
  } catch (error) { next(error); }
}

export async function updateInternship(request, response, next) {
  try {
    const company = await getCompany(request.user._id);
    if (!company) return response.status(404).json({ message: 'Company profile not found.' });

    // Find existing internship
    const existing = await Internship.findOne({ 
      _id: request.params.id, 
      companyId: company._id 
    });
    
    if (!existing) {
      return response.status(404).json({ 
        message: 'Internship not found or not owned by your company.' 
      });
    }

    // If internship was Approved and is being edited, reset to Pending for re-review
    const updates = { ...request.body };
    if (existing.status === 'Approved') {
      updates.status = 'Pending';
    }

    const internship = await Internship.findOneAndUpdate(
      { _id: request.params.id, companyId: company._id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    response.json(internship);
  } catch (error) { next(error); }
}

export async function deleteInternship(request, response, next) {
  try {
    const company = await getCompany(request.user._id);
    if (!company) return response.status(404).json({ message: 'Company profile not found.' });

    const internship = await Internship.findOneAndDelete({ 
      _id: request.params.id, 
      companyId: company._id 
    });
    
    if (!internship) {
      return response.status(404).json({ 
        message: 'Internship not found or not owned by your company.' 
      });
    }
    
    response.json({ message: 'Internship deleted successfully.' });
  } catch (error) { next(error); }
}

export async function disableInternship(request, response, next) {
  try {
    const company = await getCompany(request.user._id);
    if (!company) return response.status(404).json({ message: 'Company profile not found.' });

    const internship = await Internship.findOneAndUpdate(
      { _id: request.params.id, companyId: company._id },
      { $set: { status: 'Disabled' } },
      { new: true }
    );
    
    if (!internship) {
      return response.status(404).json({ 
        message: 'Internship not found or not owned by your company.' 
      });
    }
    
    response.json(internship);
  } catch (error) { next(error); }
}

// ─── Application Management ───────────────────────────────────────────────────

export async function getApplications(request, response, next) {
  try {
    const company = await getCompany(request.user._id);
    if (!company) return response.status(404).json({ message: 'Company profile not found.' });

    const page = Math.max(parseInt(request.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(request.query.limit, 10) || 20, 50);
    
    // Build filter
    const filter = { companyId: company._id };
    
    if (request.query.internshipId) {
      filter.internshipId = request.query.internshipId;
    }
    
    if (request.query.status) {
      filter.status = request.query.status;
    }

    const [data, totalCount] = await Promise.all([
      Application.find(filter)
        .populate({
          path: 'internshipId',
          select: 'title courseRole location'
        })
        .populate({
          path: 'studentId',
          populate: {
            path: 'userId',
            select: 'name email'
          }
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Application.countDocuments(filter),
    ]);
    
    const totalPages = Math.ceil(totalCount / limit);
    
    response.json({ 
      data,
      totalCount,
      totalPages,
      currentPage: page
    });
  } catch (error) { next(error); }
}

export async function updateApplicationStatus(request, response, next) {
  try {
    const { status } = request.body;
    
    const company = await getCompany(request.user._id);
    if (!company) return response.status(404).json({ message: 'Company profile not found.' });

    // Verify application belongs to this company's internship (ownership check)
    const application = await Application.findOne({ 
      _id: request.params.id,
      companyId: company._id 
    });
    
    if (!application) {
      return response.status(404).json({ 
        message: 'Application not found or does not belong to your company.' 
      });
    }

    // Update status
    application.status = status;
    await application.save();
    
    response.json(application);
  } catch (error) { next(error); }
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export async function getDashboardStats(request, response, next) {
  try {
    const company = await getCompany(request.user._id);
    if (!company) return response.status(404).json({ message: 'Company profile not found.' });

    const now = new Date();

    const [
      totalInternships,
      activeInternships,
      pendingInternships,
      totalApplications,
      applicationsByStatus
    ] = await Promise.all([
      // Total internships created by this company
      Internship.countDocuments({ companyId: company._id }),
      
      // Active internships (Approved and not expired)
      Internship.countDocuments({ 
        companyId: company._id,
        status: 'Approved',
        applicationDeadline: { $gte: now }
      }),
      
      // Pending internships (awaiting admin approval)
      Internship.countDocuments({ 
        companyId: company._id,
        status: 'Pending'
      }),
      
      // Total applications across all internships
      Application.countDocuments({ companyId: company._id }),
      
      // Applications grouped by status
      Application.aggregate([
        { $match: { companyId: company._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    // Transform applicationsByStatus array to object
    const statusCounts = {
      Applied: 0,
      'Under Review': 0,
      Shortlisted: 0,
      Interview: 0,
      Selected: 0,
      Rejected: 0
    };
    
    applicationsByStatus.forEach(item => {
      if (item._id) {
        statusCounts[item._id] = item.count;
      }
    });

    response.json({
      totalInternships,
      activeInternships,
      pendingInternships,
      totalApplications,
      applicationsByStatus: statusCounts
    });
  } catch (error) { next(error); }
}
