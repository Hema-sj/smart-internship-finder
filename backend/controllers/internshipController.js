import Internship from '../models/Internship.js';

const sortOptions = {
  bestMatch:      { aiMatch: -1, createdAt: -1 },
  newest:         { createdAt: -1 },
  startingSoon:   { startDate: 1 },
  highestStipend: { stipend: -1 },
};

function buildFilters(query, overrides = {}) {
  const filters = { status: 'Open' };
  const compensationType = overrides.compensationType ?? query.compensationType;
  const location         = overrides.location ?? query.location;

  if (compensationType && compensationType !== 'All') filters.compensationType = compensationType;
  if (location)   filters.location = new RegExp(`^${location}$`, 'i');
  if (query.course)     filters.course = new RegExp(query.course, 'i');
  if (query.startDate)  filters.startDate = { $gte: new Date(query.startDate) };
  if (query.keyword) {
    filters.$or = [
      { title:       new RegExp(query.keyword, 'i') },
      { course:      new RegExp(query.keyword, 'i') },
      { description: new RegExp(query.keyword, 'i') },
    ];
  }
  return filters;
}

// GET /api/internships  |  GET /api/internships/search
export async function listInternships(request, response, next) {
  try {
    const page  = Math.max(Number.parseInt(request.query.page,  10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(request.query.limit, 10) || 12, 1), 50);
    const filters = buildFilters(request.query, {
      compensationType: request.forcedCompensationType,
      location:         request.forcedLocation,
    });
    const sort = sortOptions[request.query.sort] || sortOptions.bestMatch;

    const [items, total] = await Promise.all([
      Internship.find(filters)
        .populate('companyId',      'name logo rating reviewCount verified')
        .populate('requiredSkills', 'name')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
      Internship.countDocuments(filters),
    ]);

    response.json({
      items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      sort: request.query.sort || 'bestMatch',
    });
  } catch (error) { next(error); }
}

// GET /api/internships/:id
export async function getInternship(request, response, next) {
  try {
    const internship = await Internship.findById(request.params.id)
      .populate('companyId',      'name logo description website location rating reviewCount verified')
      .populate('requiredSkills', 'name');
    if (!internship) return response.status(404).json({ message: 'Internship not found.' });
    response.json(internship);
  } catch (error) { next(error); }
}

// GET /api/internships/locations
// Returns: [{ location, total, paid, unpaid }] sorted by total desc
export async function listLocations(request, response, next) {
  try {
    const stats = await Internship.aggregate([
      { $match: { status: 'Open' } },
      {
        $group: {
          _id:    '$location',
          total:  { $sum: 1 },
          paid:   { $sum: { $cond: [{ $eq: ['$compensationType', 'Paid'] },   1, 0] } },
          unpaid: { $sum: { $cond: [{ $eq: ['$compensationType', 'Unpaid'] }, 1, 0] } },
        },
      },
      { $sort: { total: -1 } },
      { $project: { _id: 0, location: '$_id', total: 1, paid: 1, unpaid: 1 } },
    ]);
    response.json(stats);
  } catch (error) { next(error); }
}

// Shorthand helpers for dedicated routes
export const listPaidInternships = (req, res, next) => {
  req.forcedCompensationType = 'Paid';
  return listInternships(req, res, next);
};
export const listUnpaidInternships = (req, res, next) => {
  req.forcedCompensationType = 'Unpaid';
  return listInternships(req, res, next);
};
export const listInternshipsByLocation = (req, res, next) => {
  req.forcedLocation = req.params.location;
  return listInternships(req, res, next);
};
