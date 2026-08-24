export const COMPENSATION_TYPES = ['Paid', 'Unpaid', 'Stipend Not Disclosed'];

export function normalizeCompensationType(value) {
  if (!value || value === 'All') return null;
  const match = COMPENSATION_TYPES.find(
    (type) => type.toLowerCase() === String(value).toLowerCase(),
  );
  return match || null;
}
