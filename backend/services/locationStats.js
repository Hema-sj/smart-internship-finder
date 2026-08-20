import Internship from '../models/Internship.js';
import { CANONICAL_LOCATIONS } from '../constants/locations.js';

export async function aggregateLocationStats() {
  const stats = await Internship.aggregate([
    { $match: { status: 'Open' } },
    {
      $group: {
        _id:             '$location',
        total:           { $sum: 1 },
        paid:            { $sum: { $cond: [{ $eq: ['$compensationType', 'Paid'] }, 1, 0] } },
        unpaid:          { $sum: { $cond: [{ $eq: ['$compensationType', 'Unpaid'] }, 1, 0] } },
        stipendNotDiscl: { $sum: { $cond: [{ $eq: ['$compensationType', 'Stipend Not Disclosed'] }, 1, 0] } },
        avgStipend:      { $avg: { $cond: [{ $eq: ['$compensationType', 'Paid'] }, '$stipend', null] } },
      },
    },
    {
      $project: {
        _id: 0,
        location:        '$_id',
        total:           1,
        paid:            1,
        unpaid:          1,
        stipendNotDiscl: 1,
        avgStipend:      { $round: ['$avgStipend', 0] },
      },
    },
  ]);

  const byName = new Map(
    stats.map((row) => [String(row.location || '').toLowerCase(), row]),
  );

  const canonical = CANONICAL_LOCATIONS.map((location) => {
    const row = byName.get(location.toLowerCase());
    return {
      location,
      total:           row?.total || 0,
      paid:            row?.paid || 0,
      unpaid:          row?.unpaid || 0,
      stipendNotDiscl: row?.stipendNotDiscl || 0,
      avgStipend:      row?.avgStipend || 0,
    };
  });

  const extras = stats.filter(
    (row) => !CANONICAL_LOCATIONS.some(
      (name) => name.toLowerCase() === String(row.location || '').toLowerCase(),
    ),
  );

  return [...canonical, ...extras];
}
