import api from './api';

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const getDashboardStats = () => api.get('/admin/stats').then(r => r.data);

// ─── Users ────────────────────────────────────────────────────────────────────
export const listUsers    = (params) => api.get('/admin/users', { params }).then(r => r.data);
export const getUserById  = (id)     => api.get(`/admin/users/${id}`).then(r => r.data);
export const deleteUser   = (id)     => api.delete(`/admin/users/${id}`).then(r => r.data);

// ─── Companies ────────────────────────────────────────────────────────────────
export const listAllCompanies = (params) => api.get('/admin/companies', { params }).then(r => r.data);
export const verifyCompany    = (id, verified) => api.patch(`/admin/companies/${id}/verify`, { verified }).then(r => r.data);

// ─── Internships ──────────────────────────────────────────────────────────────
export const listAllInternships     = (params)  => api.get('/admin/internships', { params }).then(r => r.data);
export const updateInternshipStatus = (id, status) => api.patch(`/admin/internships/${id}/status`, { status }).then(r => r.data);
export const deleteInternshipAdmin  = (id)      => api.delete(`/admin/internships/${id}`).then(r => r.data);

// ─── Applications ─────────────────────────────────────────────────────────────
export const listAllApplications = (params) => api.get('/admin/applications', { params }).then(r => r.data);
