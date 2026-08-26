/**
 * Internship controller — public endpoints with PostgreSQL/Sequelize
 * PHASE 12: Real Internship Data & Search Integration
 */
import { Op } from 'sequelize';
import Internship from '../models/Internship.js';
import Company from '../models/Company.js';
import StudentProfile from '../models/StudentProfile.js';

/**
 * Calculate AI match score based on student skills vs internship requirements
 */
async function calculateMatchScore(userId, requiredSkills) {
  if (!userId || !requiredSkills || requiredSkills.length === 0) {
    return 0;
  }

  try {
    const profile = await StudentProfile.findOne({ where: { userId } });
    if (!profile || !profile.skills || profile.skills.length === 0) {
      return 0;
    }

    // Convert to lowercase for case-insensitive matching
    const studentSkillsLower = profile.skills.map(s => 
      (typeof s === 'string' ? s : s.name || '').toLowerCase()
    );
    const requiredSkillsLower = requiredSkills.map(s => s.toLowerCase());

    // Count matching skills
    const matchCount = requiredSkillsLower.filter(req => 
      studentSkillsLower.some(studentSkill => studentSkill.includes(req) || req.includes(studentSkill))
    ).length;

    // Calculate percentage
    const matchPercent = Math.round((matchCount / requiredSkillsLower.length) * 100);
    return Math.min(matchPercent, 100);
  } catch (error) {
    console.error('Error calculating match score:', error);
    return 0;
  }
}

/**
 * GET /api/internships - Search and filter internships
 * Supports: keyword, company, location, course, skills, compensation, certificate, date
 */
export async function getInternships(request, response, next) {
  try {
    const {
      search,        // Keyword search (title, description, skills)
      company,       // Company name
      location,      // Location
      course,        // Course/Role
      skills,        // Required skills (comma-separated)
      compensation,  // 'Paid' or 'Unpaid'
      certificate,   // Certificate type
      startDate,     // Starting date filter
      sort = 'startingDate',  // Sort field
      order = 'DESC', // Sort order
      page = 1,
      limit = 20
    } = request.query;

    const userId = request.user?.id;  // For AI match calculation (optional)

    // Build WHERE clause
    const where = {
      status: 'Approved',           // Only show approved internships
      applicationStatus: 'Open'      // Only show open internships
    };

    // Keyword search - searches in title, description, course, and skills
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { courseRole: { [Op.iLike]: `%${search}%` } },
        { requiredSkills: { [Op.overlap]: [search] } }  // PostgreSQL array overlap
      ];
    }

    // Location filter
    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }

    // Course/Role filter
    if (course) {
      where.courseRole = { [Op.iLike]: `%${course}%` };
    }

    // Skills filter (AND logic - internship must have ALL specified skills)
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      where.requiredSkills = { [Op.contains]: skillsArray };  // PostgreSQL array contains
    }

    // Compensation filter
    if (compensation) {
      if (compensation.toLowerCase() === 'paid') {
        where.compensationType = 'Paid';
      } else if (compensation.toLowerCase() === 'unpaid') {
        where.compensationType = 'Unpaid';
      }
    }

    // Certificate filter
    if (certificate) {
      where.certificateType = certificate;
    }

    // Starting date filter
    if (startDate) {
      where.startingDate = { [Op.gte]: new Date(startDate) };
    }

    // Company filter (via include)
    const include = [{
      model: Company,
      as: 'company',
      attributes: ['id', 'companyName', 'logo', 'website', 'industry'],
      where: company ? { companyName: { [Op.iLike]: `%${company}%` } } : undefined,
      required: true  // INNER JOIN to ensure company exists
    }];

    // Pagination
    const offset = (page - 1) * limit;

    // Execute query
    const { count, rows: internships } = await Internship.findAndCountAll({
      where,
      include,
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    // Calculate AI match scores for each internship
    const internshipsWithMatch = await Promise.all(
      internships.map(async (internship) => {
        const data = internship.toJSON();
        
        // Calculate match score
        if (userId) {
          data.aiMatch = await calculateMatchScore(userId, data.requiredSkills || []);
        } else {
          data.aiMatch = 0;
        }

        // Add _id alias for frontend compatibility
        data._id = data.id;
        if (data.company) {
          data.company._id = data.company.id;
        }

        // Format display fields
        data.displayCompanyLogo = data.company?.logo || '';
        data.displayCompanyName = data.company?.companyName || 'Unknown';
        data.displaySkills = (data.requiredSkills || []).slice(0, 3);

        return data;
      })
    );

    // Sort by AI match if user is logged in and no other sort specified
    if (userId && sort === 'aiMatch') {
      internshipsWithMatch.sort((a, b) => b.aiMatch - a.aiMatch);
    }

    response.json({
      internships: internshipsWithMatch,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      },
      filters: {
        search, company, location, course, skills, compensation, certificate, startDate
      }
    });

  } catch (error) {
    console.error('Get internships error:', error);
    next(error);
  }
}

/**
 * GET /api/internships/:id - Get single internship details
 */
export async function getInternshipById(request, response, next) {
  try {
    const { id } = request.params;
    const userId = request.user?.id;

    const internship = await Internship.findOne({
      where: {
        id,
        status: 'Approved',
        applicationStatus: 'Open'
      },
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'companyName', 'logo', 'website', 'industry', 'description']
      }]
    });

    if (!internship) {
      return response.status(404).json({ message: 'Internship not found' });
    }

    const data = internship.toJSON();

    // Calculate AI match
    if (userId) {
      data.aiMatch = await calculateMatchScore(userId, data.requiredSkills || []);
    } else {
      data.aiMatch = 0;
    }

    // Add _id aliases for frontend compatibility
    data._id = data.id;
    if (data.company) {
      data.company._id = data.company.id;
      data.companyId = { ...data.company };  // For nested structure compatibility
    }

    response.json(data);

  } catch (error) {
    console.error('Get internship by ID error:', error);
    next(error);
  }
}

/**
 * GET /api/internships/locations/stats - Get location statistics
 */
export async function getLocationStats(request, response, next) {
  try {
    const { location } = request.query;

    const where = {
      status: 'Approved',
      applicationStatus: 'Open'
    };

    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }

    const internships = await Internship.findAll({
      where,
      attributes: ['location', 'compensationType', 'courseRole'],
      include: [{
        model: Company,
        as: 'company',
        attributes: ['companyName'],
        required: true
      }]
    });

    // Calculate statistics
    const stats = {
      totalInternships: internships.length,
      paidInternships: internships.filter(i => i.compensationType === 'Paid').length,
      unpaidInternships: internships.filter(i => i.compensationType === 'Unpaid').length,
      companies: [...new Set(internships.map(i => i.company?.companyName))].filter(Boolean),
      roles: [...new Set(internships.map(i => i.courseRole))].filter(Boolean)
    };

    response.json(stats);

  } catch (error) {
    console.error('Get location stats error:', error);
    next(error);
  }
}

export default {
  getInternships,
  getInternshipById,
  getLocationStats
};
