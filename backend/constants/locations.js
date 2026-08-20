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

export function escapeRegex(value = '') {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function locationRegex(location) {
  return new RegExp(`^${escapeRegex(location)}$`, 'i');
}
