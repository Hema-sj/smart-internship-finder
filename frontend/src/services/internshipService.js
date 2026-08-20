import api from './api';

function buildParams({
  page = 1, limit = 10, sort = 'bestMatch',
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
  return params;
}

/**
 * Listing always uses GET /api/internships with MongoDB query filters,
 * so location can be combined with course, compensation, start date, and keyword.
 */
export async function fetchInternships(options = {}) {
  const { data } = await api.get('/internships', { params: buildParams(options) });
  return data;
}

export async function fetchInternshipById(id) {
  const { data } = await api.get(`/internships/${id}`);
  return data;
}

export async function fetchInternshipsByLocation(location, options = {}) {
  const { data } = await api.get(
    `/locations/${encodeURIComponent(location)}/internships`,
    { params: buildParams(options) },
  );
  return data;
}

export async function fetchPaidInternships(options = {}) {
  const { data } = await api.get('/internships/paid', { params: buildParams(options) });
  return data;
}

export async function fetchUnpaidInternships(options = {}) {
  const { data } = await api.get('/internships/unpaid', { params: buildParams(options) });
  return data;
}

export async function searchInternships(keyword, options = {}) {
  const { data } = await api.get('/internships/search', {
    params: buildParams({ ...options, keyword }),
  });
  return data;
}

export async function fetchLocations() {
  const { data } = await api.get('/locations');
  return data;
}

export async function fetchLocationStats() {
  try {
    const data = await fetchLocations();
    return data.locations || data;
  } catch {
    const { data } = await api.get('/internships/locations');
    return data;
  }
}

export async function fetchCourses() {
  const { data } = await api.get('/internships/courses');
  return data;
}

export async function fetchInternshipStats() {
  const { data } = await api.get('/internships/stats');
  return data;
}
