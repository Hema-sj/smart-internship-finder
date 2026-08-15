import api from './api';

// ─── Internships ─────────────────────────────────────────────────────────────

/**
 * Fetch paginated, filtered, sorted internships.
 * All filtering is done in MongoDB on the backend.
 *
 * Supported query params:
 *   page, limit, sort, keyword, location, course,
 *   compensationType, certificateType, startDate,
 *   minStipend, maxStipend, skills (comma-separated IDs)
 */
export async function fetchInternships({
  page = 1, limit = 12, sort = 'bestMatch',
  compensationType, certificateType, location, course,
  startDate, keyword, minStipend, maxStipend, skills,
} = {}) {
  const params = { page, limit, sort };
  if (compensationType && compensationType !== 'All') params.compensationType = compensationType;
  if (certificateType  && certificateType  !== 'All') params.certificateType  = certificateType;
  if (location)   params.location   = location;
  if (course)     params.course     = course;
  if (startDate)  params.startDate  = startDate;
  if (keyword)    params.keyword    = keyword;
  if (minStipend) params.minStipend = minStipend;
  if (maxStipend) params.maxStipend = maxStipend;
  if (skills)     params.skills     = skills;
  const { data } = await api.get('/internships', { params });
  return data; // { items, pagination, sort, filters }
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
export async function fetchLocationStats() {
  const { data } = await api.get('/internships/locations');
  return data;
}

// ─── Global Stats ─────────────────────────────────────────────────────────────
export async function fetchInternshipStats() {
  const { data } = await api.get('/internships/stats');
  return data;
}
