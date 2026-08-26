/**
 * Location controller — location-based internship statistics
 */
import { Op } from 'sequelize';
import Internship from '../models/Internship.js';
import Company from '../models/Company.js';

/**
 * GET /api/locations - Get all locations with internship counts
 */
export async function getAllLocations(request, response, next) {
  try {
    const internships = await Internship.findAll({
      where: {
        status: 'Approved',
        applicationStatus: 'Open'
      },
      attributes: ['location'],
      include: [{
        model: Company,
        as: 'company',
        attributes: [],
        required: true
      }]
    });

    // Count internships by location
    const locationCounts = {};
    internships.forEach(internship => {
      const loc = internship.location;
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });

    // Convert to array and sort by count
    const locations = Object.entries(locationCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    response.json(locations);

  } catch (error) {
    console.error('Get all locations error:', error);
    next(error);
  }
}

/**
 * GET /api/locations/:location - Get internships for specific location
 */
export async function getLocationInternships(request, response, next) {
  try {
    const { location } = request.params;
    const {
      course,
      company,
      compensation,
      skills,
      mode,
      sort = 'startingDate',
      order = 'DESC',
      page = 1,
      limit = 20
    } = request.query;

    const where = {
      status: 'Approved',
      applicationStatus: 'Open',
      location: { [Op.iLike]: `%${location}%` }
    };

    // Apply filters
    if (course) {
      where.courseRole = { [Op.iLike]: `%${course}%` };
    }

    if (compensation) {
      where.compensationType = compensation;
    }

    if (mode) {
      where.mode = mode;
    }

    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      where.requiredSkills = { [Op.overlap]: skillsArray };
    }

    const include = [{
      model: Company,
      as: 'company',
      attributes: ['id', 'companyName', 'logo', 'website', 'industry'],
      where: company ? { companyName: { [Op.iLike]: `%${company}%` } } : undefined,
      required: true
    }];

    const offset = (page - 1) * limit;

    const { count, rows: internships } = await Internship.findAndCountAll({
      where,
      include,
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    // Format for frontend
    const formattedInternships = internships.map(internship => {
      const data = internship.toJSON();
      data._id = data.id;
      if (data.company) {
        data.company._id = data.company.id;
      }
      return data;
    });

    response.json({
      internships: formattedInternships,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Get location internships error:', error);
    next(error);
  }
}

/**
 * GET /api/locations/:location/stats - Get statistics for a location
 */
export async function getLocationStats(request, response, next) {
  try {
    const { location } = request.params;

    const internships = await Internship.findAll({
      where: {
        status: 'Approved',
        applicationStatus: 'Open',
        location: { [Op.iLike]: `%${location}%` }
      },
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'companyName'],
        required: true
      }]
    });

    const total = internships.length;
    const paid = internships.filter(i => i.compensationType === 'Paid').length;
    const unpaid = internships.filter(i => i.compensationType === 'Unpaid').length;

    const companies = [...new Set(internships.map(i => ({
      _id: i.company.id,
      companyName: i.company.companyName
    })).map(c => JSON.stringify(c)))].map(c => JSON.parse(c));

    const roles = [...new Set(internships.map(i => i.courseRole))].filter(Boolean);
    
    const skills = [...new Set(internships.flatMap(i => i.requiredSkills || []))].filter(Boolean);

    response.json({
      totalInternships: total,
      paidInternships: paid,
      unpaidInternships: unpaid,
      companies,
      popularRoles: roles.slice(0, 10),
      popularSkills: skills.slice(0, 20),
      location
    });

  } catch (error) {
    console.error('Get location stats error:', error);
    next(error);
  }
}

export default {
  getAllLocations,
  getLocationInternships,
  getLocationStats
};
