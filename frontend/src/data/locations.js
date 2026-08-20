export const CANONICAL_LOCATIONS = [
  'Chennai',
  'Bangalore',
  'Coimbatore',
  'Hyderabad',
  'Pune',
  'Mumbai',
  'Delhi',
  'Kochi',
  'Remote',
];

export const LOCATION_GRADIENTS = {
  Chennai:    'from-rose-500 to-orange-400',
  Bangalore:  'from-violet-600 to-indigo-500',
  Coimbatore: 'from-emerald-600 to-teal-500',
  Hyderabad:  'from-blue-600 to-cyan-500',
  Pune:       'from-amber-500 to-yellow-400',
  Mumbai:     'from-pink-600 to-rose-500',
  Delhi:      'from-red-600 to-orange-500',
  Kochi:      'from-teal-600 to-green-500',
  Remote:     'from-slate-600 to-slate-500',
};

export function emptyLocationStat(location) {
  return { location, total: 0, paid: 0, unpaid: 0 };
}

export function mergeLocationStats(stats = []) {
  const map = Object.fromEntries(
    (stats || []).map((row) => [String(row.location || '').toLowerCase(), row]),
  );

  const canonical = CANONICAL_LOCATIONS.map((location) => {
    const row = map[location.toLowerCase()];
    return row ? { ...emptyLocationStat(location), ...row, location } : emptyLocationStat(location);
  });

  const extras = (stats || []).filter(
    (row) => !CANONICAL_LOCATIONS.some(
      (name) => name.toLowerCase() === String(row.location || '').toLowerCase(),
    ),
  );

  return [...canonical, ...extras];
}
