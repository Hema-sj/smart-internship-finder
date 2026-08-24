import api from './api';

// ─── Company Profile ──────────────────────────────────────────────────────────
export const getMyCompany    = ()     => api.get('/companies/me').then(r => r.data);
export const updateMyCompany = (data) => api.put('/companies/me', data).then(r => r.data);

// ─── Internship Management ────────────────────────────────────────────────────
export const getMyInternships  = (params) => api.get('/companies/me/internships', { params }).then(r => r.data);
export const createInternship  = (data)   => api.post('/companies/me/internships', data).then(r => r.data);
export const updateInternship  = (id, data) => api.put(`/companies/me/internships/${id}`, data).then(r => r.data);
export const deleteInternship  = (id)     => api.delete(`/companies/me/internships/${id}`).then(r => r.data);

// ─── Application Management ───────────────────────────────────────────────────
export const getInternshipApplications = (internshipId) => api.get(`/companies/me/internships/${internshipId}/applications`).then(r => r.data);
export const updateApplicationStatus   = (id, status)   => api.patch(`/companies/me/applications/${id}/status`, { status }).then(r => r.data);
