/**
 * Location controller - Provides location-based internship statistics and data
 */
import Internship from '../models/Internship.js';
import Company from '../models/Company.js';
import { enhanceInternshipForDisplay } from '../utils/internshipFormatters.js';

/**
 * GET /api/locations/:location/stats
 * Get comprehensive statistics for a specific location
 */
export async function getLocationStats(request, response, next) {
  try {
    const { location } = request.params;
    
    // Case-insensitive location match
    const locationRegex = new RegExp(`^${location}$`, 'i');
    
    // Get all approved internships for this location
    const internships = await Internship.find({ 
      location: locationRegex, 
      status: 'Approved' 
    })
      .populate('companyId', 'companyName logo website industry description')
      .lean();
    
    if (internships.length === 0) {
      return response.json({
        location,
        totalInternships: 0,
        paidInternships: 0,
        unpaidInternships: 0,
        notDisclosedInternships: 0,
        companies: [],
        popularRoles: [],
        availableCourses: [],
        popularSkills: [],
        averageStipend: null,
        minStipend: null,
        maxStipend: null,
        modeBreakdown: { Remote: 0, 'On-site': 0, Hybrid: 0 },
        certificateBreakdown: {},
        upcomingDeadlines: [],
      });
    }
    
    // Calculate statistics
    const totalInternships = internships.length;
    const paidInternships = internships.filter(i => i.compensationType === 'Paid').length;
    const unpaidInternships = internships.filter(i => i.compensationType === 'Unpaid').length;
    const notDisclosedInternships = internships.filter(i => i.compensationType === 'Not Disclosed').length;
    
    // Get unique companies
    const companiesMap = new Map();
    internships.forEach(i => {
      if (i.companyId && i.companyId._id) {
        const companyId = i.companyId._id.toString();
        if (!companiesMap.has(companyId)) {
          companiesMap.set(companyId, {
            _id: i.companyId._id,
            companyName: i.companyId.companyName,
            logo: i.companyId.logo,
            website: i.companyId.website,
            industry: i.companyId.industry,
            internshipCount: 0,
          });
        }
        companiesMap.get(companyId).internshipCount += 1;
      }
    });
    
    const companies = Array.from(companiesMap.values())
      .sort((a, b) => b.internshipCount - a.internshipCount);
    
    // Popular roles
    const rolesMap = new Map();
    internships.forEach(i => {
      const role = i.courseRole || i.title;
      rolesMap.set(role, (rolesMap.get(role) || 0) + 1);
    });
    const popularRoles = Array.from(rolesMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([role, count]) => ({ role, count }));
    
    // Available courses
    const coursesSet = new Set();
    internships.forEach(i => {
      if (i.courseRole) coursesSet.add(i.courseRole);
    });
    const availableCourses = Array.from(coursesSet).sort();
    
    // Popular skills
    const skillsMap = new Map();
    internships.forEach(i => {
      if (i.requiredSkills && i.requiredSkills.length > 0) {
        i.requiredSkills.forEach(skill => {
          skillsMap.set(skill, (skillsMap.get(skill) || 0) + 1);
        });
      }
    });
    const popularSkills = Array.from(skillsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([skill, count]) => ({ skill, count }));
    
    // Stipend statistics (only for Paid internships)
    const paidWithStipend = internships.filter(i => 
      i.compensationType === 'Paid' && i.stipend !== null && i.stipend > 0
    );
    
    let averageStipend = null;
    let minStipend = null;
    let maxStipend = null;
    
    if (paidWithStipend.length > 0) {
      const stipends = paidWithStipend.map(i => i.stipend);
      averageStipend = Math.round(stipends.reduce((a, b) => a + b, 0) / stipends.length);
      minStipend = Math.min(...stipends);
      maxStipend = Math.max(...stipends);
    }
    
    // Mode breakdown
    const modeBreakdown = {
      Remote: internships.filter(i => i.mode === 'Remote').length,
      'On-site': internships.filter(i => i.mode === 'On-site').length,
      Hybrid: internships.filter(i => i.mode === 'Hybrid').length,
    };
    
    // Certificate breakdown
    const certificateBreakdown = {};
    internships.forEach(i => {
      const cert = i.certificateType || 'Not Disclosed';
      certificateBreakdown[cert] = (certificateBreakdown[cert] || 0) + 1;
    });
    
    // Upcoming deadlines (next 30 days)
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const upcomingDeadlines = internships
      .filter(i => i.applicationDeadline && 
                   new Date(i.applicationDeadline) >= now && 
                   new Date(i.applicationDeadline) <= thirtyDaysFromNow)
      .map(i => ({
        _id: i._id,
        title: i.title,
        companyName: i.companyId?.companyName,
        deadline: i.applicationDeadline,
      }))
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    
    response.json({
      location,
      totalInternships,
      paidInternships,
      unpaidInternships,
      notDisclosedInternships,
      companies,
      popularRoles,
      availableCourses,
      popularSkills,
      averageStipend,
      minStipend,
      maxStipend,
      modeBreakdown,
      certificateBreakdown,
      upcomingDeadlines,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/locations/:location/internships
 * Get all internships for a specific location with filters
 */
export async function getLocationInternships(request, response, next) {
  try {
    const { location } = request.params;
    const page = Math.max(parseInt(request.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(request.query.limit, 10) || 20, 50);
    
    // Case-insensitive location match
    const locationRegex = new RegExp(`^${location}$`, 'i');
    
    // Build filter
    const filter = { 
      location: locationRegex, 
      status: 'Approved' 
    };
    
    // Apply additional filters
    if (request.query.course) {
      filter.courseRole = new RegExp(request.query.course, 'i');
    }
    
    if (request.query.company) {
      const matchingCompanies = await Company.find({ 
        companyName: new RegExp(request.query.company, 'i')
      }).select('_id').limit(20);
      filter.companyId = { $in: matchingCompanies.map(c => c._id) };
    }
    
    if (request.query.compensationType) {
      filter.compensationType = request.query.compensationType;
    }
    
    if (request.query.mode) {
      filter.mode = request.query.mode;
    }
    
    if (request.query.skill) {
      filter.requiredSkills = new RegExp(request.query.skill, 'i');
    }
    
    if (request.query.startDate) {
      filter.startingDate = { $gte: new Date(request.query.startDate) };
    }
    
    // Sorting
    let sort = { createdAt: -1 };
    const sortBy = request.query.sortBy || request.query.sort || 'newest';
    
    switch (sortBy) {
      case 'latest':
        sort = { createdAt: -1 };
        break;
      case 'upcoming':
        sort = { startingDate: 1 };
        break;
      case 'highestStipend':
        sort = { stipend: -1, createdAt: -1 };
        break;
      case 'deadline':
        sort = { applicationDeadline: 1 };
        break;
      case 'aiMatch':
        sort = { aiMatch: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }
    
    // Execute query
    const [internships, totalCount] = await Promise.all([
      Internship.find(filter)
        .populate('companyId', 'companyName logo website industry')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Internship.countDocuments(filter),
    ]);
    
    // Enhance with display fields
    const data = internships.map(internship => enhanceInternshipForDisplay({
      ...internship,
      internshipId: internship._id
    }));
    
    const totalPages = Math.ceil(totalCount / limit);
    
    response.json({
      data,
      totalCount,
      totalPages,
      currentPage: page,
      location,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/companies/:id
 * Get company profile with all internships
 */
export async function getCompanyProfile(request, response, next) {
  try {
    const company = await Company.findById(request.params.id).lean();
    
    if (!company) {
      return response.status(404).json({ message: 'Company not found.' });
    }
    
    // Get all approved internships for this company
    const internships = await Internship.find({ 
      companyId: company._id, 
      status: 'Approved' 
    })
      .sort({ createdAt: -1 })
      .lean();
    
    // Extract unique roles
    const roles = [...new Set(internships.map(i => i.courseRole || i.title))];
    
    // Extract all required skills
    const skillsSet = new Set();
    internships.forEach(i => {
      if (i.requiredSkills) {
        i.requiredSkills.forEach(skill => skillsSet.add(skill));
      }
    });
    const requiredSkills = Array.from(skillsSet);
    
    // Calculate average rating (if available)
    const ratingsAvailable = internships.filter(i => i.companyRating !== null);
    const averageRating = ratingsAvailable.length > 0
      ? ratingsAvailable.reduce((sum, i) => sum + i.companyRating, 0) / ratingsAvailable.length
      : null;
    
    // Enhance internships with display fields
    const enhancedInternships = internships.map(i => enhanceInternshipForDisplay({
      ...i,
      internshipId: i._id
    }));
    
    response.json({
      _id: company._id,
      companyName: company.companyName,
      logo: company.logo,
      description: company.description,
      website: company.website,
      industry: company.industry,
      location: company.location,
      verified: company.verified_status === 'approved',
      totalInternships: internships.length,
      availableRoles: roles,
      requiredSkills,
      averageRating: averageRating ? averageRating.toFixed(1) : null,
      internships: enhancedInternships,
    });
  } catch (error) {
    next(error);
  }
}
