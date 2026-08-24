/**
 * Internship controller
 * - Full-text search across title, course, description, company name
 * - Filters: location, course, compensationType, certificateType, startDate, skill
 * - Sorting: bestMatch, newest, startingSoon, highestStipend
 * - Pagination with configurable limit (max 50)
 * - Location stats aggregation
 */
import mongoose  from 'mongoose';
import Internship from '../models/Internship.js';
import Company    from '../models/Company.js';     // must be imported to register schema
import '../models/Skill.js';                        // must be imported to register schema
import { escapeRegex, locationRegex } from '../constants/locations.js';
import { normalizeCompensationType } from '../constants/compensation.js';
import { normalizeCertificateType } from '../constants/certificates.js';
import { aggregateLocationStats } from '../services/locationStats.js';

// ─── Sort presets ─────────────────────────────────────────────────────────────
const SORT_PRESETS = {
  bestMatch:      { aiMatch: -1, createdAt: -1 },
  newest:         { createdAt: -1 },
  startingSoon:   { startDate: 1, createdAt: -1 },
  highestStipend: { stipend: -1, createdAt: -1 },
};

// ─── Filter builder ───────────────────────────────────────────────────────────
async function buildFilters(query, overrides = {}) {
  const filters = { status: 'Open' };

  // Allow caller to force a value (used by shorthand helpers)
  const rawCompensation    = overrides.compensationType ?? query.compensationType ?? query.comp;
  const compensationType   = normalizeCompensationType(rawCompensation);
  const location         = overrides.location         ?? query.location;
  const keyword          = query.keyword || query.q || query.search;
  const course           = query.course;

  // ── Compensation (exact match — Stipend Not Disclosed is its own category) ──
  if (compensationType) {
    filters.compensationType = compensationType;
  }

  // ── Certificate type (Phase 8) ──
  // Supports ?certificateType=Hard Copy|Soft Copy|Both|Not Provided|Not Disclosed
  // and ?certificateProvided=true|false. Both combine with every other filter.
  const certificateType = normalizeCertificateType(query.certificateType);
  if (certificateType) {
    filters.certificateType = certificateType;
  }
  if (query.certificateProvided === 'true' || query.certificateProvided === true) {
    filters.certificateProvided = true;
  } else if (query.certificateProvided === 'false' || query.certificateProvided === false) {
    filters.certificateProvided = false;
  }

  // ── Location (exact, case-insensitive) — MongoDB only ──
  if (location) {
    filters.location = locationRegex(location);
  }

  // ── Course (partial match) ──
  if (course) {
    filters.course = new RegExp(escapeRegex(course), 'i');
  }

  // ── Starting date (on or after) ──
  if (query.startDate) {
    const d = new Date(query.startDate);
    if (!isNaN(d)) filters.startDate = { $gte: d };
  }

  // ── Stipend range ──
  if (query.minStipend) filters.stipend = { ...filters.stipend, $gte: Number(query.minStipend) };
  if (query.maxStipend) filters.stipend = { ...filters.stipend, $lte: Number(query.maxStipend) };

  // ── Skill IDs ──
  if (query.skills) {
    const skillIds = query.skills.split(',')
      .map(s => s.trim())
      .filter(s => mongoose.isValidObjectId(s))
      .map(s => new mongoose.Types.ObjectId(s));
    if (skillIds.length) filters.requiredSkills = { $in: skillIds };
  }

  // ── Keyword search (title, course, description + company name) ──
  if (keyword) {
    const kw = escapeRegex(keyword);
    const kwRe = new RegExp(kw, 'i');

    // Find companies matching the keyword
    const matchingCompanies = await Company.find({ name: kwRe }).select('_id').limit(20);
    const companyIds = matchingCompanies.map(c => c._id);

    const textConditions = [
      { title:       kwRe },
      { course:      kwRe },
      { description: kwRe },
    ];
    if (companyIds.length) textConditions.push({ companyId: { $in: companyIds } });

    // Merge with any existing $or (e.g., from mode or status filters)
    filters.$or = textConditions;
  }

  return filters;
}

// ─── GET /api/internships   |   GET /api/internships/search ──────────────────
export async function listInternships(request, response, next) {
  try {
    const page  = Math.max(parseInt(request.query.page,  10) || 1,  1);
    const limit = Math.min(Math.max(parseInt(request.query.limit, 10) || 12, 1), 50);
    const sort  = SORT_PRESETS[request.query.sort] || SORT_PRESETS.bestMatch;

    const filters = await buildFilters(request.query, {
      compensationType: request.forcedCompensationType,
      location:         request.forcedLocation,
    });

    const [items, total] = await Promise.all([
      Internship.find(filters)
        .populate('companyId',      'name logo rating reviewCount verified location industry')
        .populate('requiredSkills', 'name')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Internship.countDocuments(filters),
    ]);

    // Attach display helpers
    const enriched = items.map(i => ({
      ...i,
      company: i.companyId, // alias for frontend convenience
    }));

    response.json({
      items: enriched,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      sort:        request.query.sort || 'bestMatch',
      filters: {
        compensationType: request.forcedCompensationType
          || normalizeCompensationType(request.query.compensationType || request.query.comp)
          || 'All',
        certificateType:  normalizeCertificateType(request.query.certificateType) || 'All',
        location:         request.forcedLocation || request.query.location || '',
        course:           request.query.course            || '',
        keyword:          request.query.keyword || request.query.q || request.query.search || '',
        startDate:        request.query.startDate         || '',
      },
    });
  } catch (error) { next(error); }
}

// ─── GET /api/internships/:id ─────────────────────────────────────────────────
export async function getInternship(request, response, next) {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) {
      return response.status(404).json({ message: 'Internship not found.' });
    }
    const internship = await Internship.findById(request.params.id)
      .populate('companyId',      'name logo description website location rating reviewCount verified industry size founded')
      .populate('requiredSkills', 'name')
      .lean();
    if (!internship) return response.status(404).json({ message: 'Internship not found.' });
    response.json({ ...internship, company: internship.companyId });
  } catch (error) { next(error); }
}

// ─── GET /api/internships/locations ──────────────────────────────────────────
export async function listLocations(request, response, next) {
  try {
    const locations = await aggregateLocationStats();
    response.json(locations);
  } catch (error) { next(error); }
}

// ─── GET /api/internships/stats ───────────────────────────────────────────────
export async function getStats(request, response, next) {
  try {
    const [
      total, paid, unpaid, stipendNotDisclosed, remote,
      hardCopy, softCopy, bothCertificates, notProvided,
      avgStipend, topLocations, topCourses,
    ] = await Promise.all([
      Internship.countDocuments({ status: 'Open' }),
      Internship.countDocuments({ status: 'Open', compensationType: 'Paid' }),
      Internship.countDocuments({ status: 'Open', compensationType: 'Unpaid' }),
      Internship.countDocuments({ status: 'Open', compensationType: 'Stipend Not Disclosed' }),
      Internship.countDocuments({ status: 'Open', location: /^remote$/i }),
      // ── Phase 8: certificate statistics ──
      Internship.countDocuments({ status: 'Open', certificateType: 'Hard Copy' }),
      Internship.countDocuments({ status: 'Open', certificateType: 'Soft Copy' }),
      Internship.countDocuments({ status: 'Open', certificateType: 'Both' }),
      Internship.countDocuments({ status: 'Open', certificateProvided: false }),
      Internship.aggregate([
        { $match: { status: 'Open', compensationType: 'Paid', stipend: { $gt: 0 } } },
        { $group: { _id: null, avg: { $avg: '$stipend' } } },
      ]),
      Internship.aggregate([
        { $match: { status: 'Open' } },
        { $group: { _id: '$location', count: { $sum: 1 } } },
        { $sort: { count: -1 } }, { $limit: 5 },
        { $project: { _id: 0, location: '$_id', count: 1 } },
      ]),
      Internship.aggregate([
        { $match: { status: 'Open' } },
        { $group: { _id: '$course', count: { $sum: 1 } } },
        { $sort: { count: -1 } }, { $limit: 8 },
        { $project: { _id: 0, course: '$_id', count: 1 } },
      ]),
    ]);

    response.json({
      total, paid, unpaid, stipendNotDisclosed, remote,
      hardCopy, softCopy, bothCertificates, notProvided,
      avgStipend: Math.round(avgStipend[0]?.avg || 0),
      topLocations,
      topCourses,
    });
  } catch (error) { next(error); }
}

// ─── Shorthand helpers ────────────────────────────────────────────────────────
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

// ─── GET /api/internships/courses ────────────────────────────────────────────
export async function listCourses(request, response, next) {
  try {
    const courses = await Internship.distinct('course', { status: 'Open' });
    response.json(courses.filter(Boolean).sort((a, b) => a.localeCompare(b)));
  } catch (error) { next(error); }
}
