import api from './api';

// ─── Internships ─────────────────────────────────────────────────────────────

/**
 * Fetch paginated, filtered, sorted internships.
 * All filtering is done in MongoDB on the backend.
 */
export async function fetchInternships({
  page = 1, limit = 12, sort = 'bestMatch',
  compensationType, location, course, startDate, keyword,
} = {}) {
  const params = { page, limit, sort };
  if (compensationType && compensationType !== 'All') params.compensationType = compensationType;
  if (location)   params.location  = location;
  if (course)     params.course    = course;
  if (startDate)  params.startDate = startDate;
  if (keyword)    params.keyword   = keyword;
  const { data } = await api.get('/internships', { params });
  return data; // { items, pagination, sort }
}

export async function fetchInternshipById(id) {
  const { data } = await api.get(`/internships/${id}`);
  return data;
}

export async function fetchInternshipsByLocation(location, params = {}) {
  const { data } = await api.get(`/internships/location/${encodeURIComponent(location)}`, { params });
  return data;
}

// ─── Location Stats ───────────────────────────────────────────────────────────

/**
 * Returns [{ location, total, paid, unpaid }] sorted by total desc.
 * Falls back to derived static counts if the API is unavailable.
 */
export async function fetchLocationStats() {
  const { data } = await api.get('/internships/locations');
  return data;
}
