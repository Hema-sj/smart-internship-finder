/**
 * Internship controller — public endpoints for student-facing search
 * Returns ONLY Approved internships with filtering, search, and sorting
 */
import Internship from '../models/Internship.js';
import Company from '../models/Company.js';
import StudentProfile from '../models/StudentProfile.js';

/**
 * Calculate match score based on required skills overlap
 * Simple implementation - can be enhanced with AI service
 */
async function calculateMatchScore(studentId, requiredSkills) {
  if (!studentId || !requiredSkills || requiredSkills.length === 0) {
    return 0;
  }

  try {
    const profile = await StudentProfile.findOne({ userId: studentId });
    if (!profile || !profile.skills || profile.skills.length === 0) {
      return 0;
    }

    // Convert student skills to lowercase for case-insensitive matching
    const studentSkillsLower = profile.skills.map(s => 
      (typeof s === 'string' ? s : s.name || '').toLowerCase()
    );
    const requiredSkillsLower = requiredSkills.map(s => s.toLowerCase());

    // Count matching skills
    const matchCount = requiredSkillsLower.filter(req => 
      studentSkillsLower.includes(req)
    ).length;

    // Calculate percentage
    const matchPercent = Math.round((matchCount / requiredSkillsLower.length) * 100);
    return matchPercent;
  } catch (error) {
    console.error('Error calculating match score:', error);
    return 0;
  }
}

/**
 * GET /api/internships — Public endpoint for student-facing search
 * Returns ONLY status: "Approved" internships
 */
export async function getInternships(request, response, next) {
  try {
    const page = Math.max(parseInt(request.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(request.query.limit, 10) || 20, 50);
    
    // Build filter - ONLY Approved internships
    const filter = { status: 'Approved' };
    
    // ─── Search ───────────────────────────────────────────────────────────────
    if (request.query.keyword) {
      const keyword = request.query.keyword.trim();
      const keywordRegex = new RegExp(keyword, 'i');
      
      // Find companies matching the keyword
      const matchingCompanies = await Company.find({ 
        companyName: keywordRegex 
      }).select('_id').limit(20);
      const companyIds = matchingCompanies.map(c => c._id);
      
      filter.$or = [
        { title: keywordRegex },
        { courseRole: keywordRegex },
        { requiredSkills: keywordRegex },
        { companyId: { $in: companyIds } }
      ];
    }
    
    // ─── Filters ──────────────────────────────────────────────────────────────
    if (request.query.course) {
      filter.courseRole = new RegExp(request.query.course, 'i');
    }
    
    if (request.query.location) {
      filter.location = new RegExp(request.query.location, 'i');
    }
    
    if (request.query.compensationType) {
      filter.compensationType = request.query.compensationType;
    }
    
    if (request.query.certificateType) {
      filter.certificateType = request.query.certificateType;
    }
    
    // Starting date range
    if (request.query.startDateFrom || request.query.startDateTo) {
      filter.startingDate = {};
      if (request.query.startDateFrom) {
        filter.startingDate.$gte = new Date(request.query.startDateFrom);
      }
      if (request.query.startDateTo) {
        filter.startingDate.$lte = new Date(request.query.startDateTo);
      }
    }
    
    // ─── Sorting ──────────────────────────────────────────────────────────────
    let sort = { createdAt: -1 }; // default: newest
    
    const sortBy = request.query.sortBy || 'newest';
    
    switch (sortBy) {
      case 'bestMatch':
        // Requires student authentication for match score calculation
        if (request.user && request.user.role === 'student') {
          sort = { aiMatch: -1, createdAt: -1 };
        } else {
          sort = { createdAt: -1 }; // fallback to newest if not authenticated
        }
        break;
      case 'startingSoon':
        sort = { startingDate: 1, createdAt: -1 };
        break;
      case 'highestStipend':
        sort = { stipend: -1, createdAt: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }
    
    // ─── Query Execution ──────────────────────────────────────────────────────
    const [internships, totalCount] = await Promise.all([
      Internship.find(filter)
        .populate('companyId', 'companyName logo')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Internship.countDocuments(filter),
    ]);
    
    // ─── Calculate Match Scores (if authenticated student) ───────────────────
    let data = internships;
    if (request.user && request.user.role === 'student') {
      data = await Promise.all(
        internships.map(async (internship) => {
          const matchScore = await calculateMatchScore(
            request.user._id,
            internship.requiredSkills
          );
          return {
            ...internship,
            matchScore,
            companyName: internship.companyId?.companyName || 'Unknown Company',
            internshipId: internship._id
          };
        })
      );
    } else {
      // For non-authenticated users, just format the response
      data = internships.map(internship => ({
        ...internship,
        matchScore: null,
        companyName: internship.companyId?.companyName || 'Unknown Company',
        internshipId: internship._id
      }));
    }
    
    const totalPages = Math.ceil(totalCount / limit);
    
    response.json({
      data,
      totalCount,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/internships/:id — Get full internship details
 * Returns Approved internships, or any status if requester is the owning company/admin
 */
export async function getInternshipById(request, response, next) {
  try {
    const internship = await Internship.findById(request.params.id)
      .populate('companyId', 'companyName logo website industry description')
      .lean();
    
    if (!internship) {
      return response.status(404).json({ message: 'Internship not found.' });
    }
    
    // Check if internship is Approved OR if requester is owner/admin
    const isOwner = request.user && 
                    request.user.role === 'company' && 
                    internship.companyId.userId?.toString() === request.user._id.toString();
    
    const isAdmin = request.user && request.user.role === 'admin';
    
    if (internship.status !== 'Approved' && !isOwner && !isAdmin) {
      return response.status(404).json({ message: 'Internship not found.' });
    }
    
    // Calculate match score if student is authenticated
    let matchScore = null;
    if (request.user && request.user.role === 'student') {
      matchScore = await calculateMatchScore(
        request.user._id,
        internship.requiredSkills
      );
    }
    
    response.json({
      ...internship,
      matchScore,
      companyName: internship.companyId?.companyName || 'Unknown Company',
      internshipId: internship._id
    });
  } catch (error) {
    next(error);
  }
}
