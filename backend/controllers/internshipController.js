import Internship from '../models/Internship.js';

const sortOptions = {
  bestMatch: { aiMatch: -1, createdAt: -1 },
  newest: { createdAt: -1 },
  startingSoon: { startDate: 1 },
  highestStipend: { stipend: -1 }
};

function createFilters(query, forcedCompensationType, forcedLocation) {
  const filters = { status: 'Open' };
  const compensationType = forcedCompensationType || query.compensationType;
  const location = forcedLocation || query.location;
  if (compensationType && compensationType !== 'All') filters.compensationType = compensationType;
  if (location) filters.location = new RegExp(`^${location}$`, 'i');
  if (query.course) filters.course = new RegExp(query.course, 'i');
  if (query.startDate) filters.startDate = { $gte: new Date(query.startDate) };
  if (query.keyword) filters.$or = [{ title: new RegExp(query.keyword, 'i') }, { course: new RegExp(query.keyword, 'i') }, { description: new RegExp(query.keyword, 'i') }];
  return filters;
}

export async function listInternships(request, response, next) {
  try {
    const page = Math.max(Number.parseInt(request.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(request.query.limit, 10) || 12, 1), 50);
    const filters = createFilters(request.query, request.forcedCompensationType, request.forcedLocation);
    const [items, total] = await Promise.all([
      Internship.find(filters).populate('companyId', 'name logo rating verified').populate('requiredSkills', 'name').sort(sortOptions[request.query.sort] || sortOptions.bestMatch).skip((page - 1) * limit).limit(limit),
      Internship.countDocuments(filters)
    ]);
    response.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) }, sort: request.query.sort || 'bestMatch' });
  } catch (error) { next(error); }
}

export async function getInternship(request, response, next) {
  try {
    const internship = await Internship.findById(request.params.id).populate('companyId', 'name logo description website location rating reviewCount verified').populate('requiredSkills', 'name');
    if (!internship) return response.status(404).json({ message: 'Internship not found.' });
    response.json(internship);
  } catch (error) { next(error); }
}

export const listPaidInternships = (request, response, next) => { request.forcedCompensationType = 'Paid'; return listInternships(request, response, next); };
export const listUnpaidInternships = (request, response, next) => { request.forcedCompensationType = 'Unpaid'; return listInternships(request, response, next); };
export const listInternshipsByLocation = (request, response, next) => { request.forcedLocation = request.params.location; return listInternships(request, response, next); };
