/**
 * Location-based internship system
 * GET /api/locations
 * GET /api/locations/:location/internships
 *
 * Counts and listings are computed in MongoDB — never in the client.
 */
import Internship from '../models/Internship.js';
import { CANONICAL_LOCATIONS, locationRegex } from '../constants/locations.js';
import { aggregateLocationStats } from '../services/locationStats.js';
import { listInternships } from './internshipController.js';

// ─── GET /api/locations ───────────────────────────────────────────────────────
export async function listLocations(request, response, next) {
  try {
    const locations = await aggregateLocationStats();
    response.json({
      locations,
      canonical: CANONICAL_LOCATIONS,
    });
  } catch (error) { next(error); }
}

// ─── GET /api/locations/:location ─────────────────────────────────────────────
export async function getLocation(request, response, next) {
  try {
    const { location } = request.params;
    const match = locationRegex(location);
    const [stat] = await Internship.aggregate([
      { $match: { status: 'Open', location: match } },
      {
        $group: {
          _id:    null,
          total:  { $sum: 1 },
          paid:   { $sum: { $cond: [{ $eq: ['$compensationType', 'Paid'] }, 1, 0] } },
          unpaid: { $sum: { $cond: [{ $eq: ['$compensationType', 'Unpaid'] }, 1, 0] } },
        },
      },
    ]);

    const canonical = CANONICAL_LOCATIONS.find(
      (name) => name.toLowerCase() === location.toLowerCase(),
    ) || location;

    response.json({
      location: canonical,
      total:  stat?.total  || 0,
      paid:   stat?.paid   || 0,
      unpaid: stat?.unpaid || 0,
    });
  } catch (error) { next(error); }
}

// ─── GET /api/locations/:location/internships ────────────────────────────────
export function listInternshipsForLocation(request, response, next) {
  request.forcedLocation = request.params.location;
  request.query.location = request.params.location;
  return listInternships(request, response, next);
}
