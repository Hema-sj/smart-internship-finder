/**
 * Location Service - API calls for location-based data
 */
import api from './api';

/**
 * Fetch location statistics
 * @param {string} location - Location name (e.g., "Chennai")
 * @returns {Promise<Object>} Location statistics
 */
export async function fetchLocationStats(location) {
  const response = await api.get(`/locations/${encodeURIComponent(location)}/stats`);
  return response.data;
}

/**
 * Fetch internships for a specific location
 * @param {string} location - Location name
 * @param {Object} params - Query parameters (page, limit, filters, sort)
 * @returns {Promise<Object>} Internships data
 */
export async function fetchLocationInternships(location, params = {}) {
  const response = await api.get(`/locations/${encodeURIComponent(location)}/internships`, { params });
  return response.data;
}

/**
 * Fetch company profile
 * @param {string} companyId - Company ID
 * @returns {Promise<Object>} Company profile data
 */
export async function fetchCompanyProfile(companyId) {
  const response = await api.get(`/locations/company/${companyId}`);
  return response.data;
}
