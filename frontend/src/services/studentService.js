import api from './api';

// ─── Student Profile ──────────────────────────────────────────────────────────
export const getMyProfile     = ()       => api.get('/students/me/profile').then(r => r.data);
export const updateMyProfile  = (data)   => api.put('/students/me/profile', data).then(r => r.data);

// ─── Applications ─────────────────────────────────────────────────────────────
export const getMyApplications = ()             => api.get('/students/me/applications').then(r => r.data);
export const applyToInternship = (internshipId) => api.post('/students/me/applications', { internshipId }).then(r => r.data);
export const withdrawApplication = (id)         => api.delete(`/students/me/applications/${id}`).then(r => r.data);

// ─── Saved Internships ────────────────────────────────────────────────────────
export const getSaved         = ()             => api.get('/students/me/saved').then(r => r.data);
export const saveInternship   = (internshipId) => api.post('/students/me/saved', { internshipId }).then(r => r.data);
export const unsaveInternship = (id)           => api.delete(`/students/me/saved/${id}`).then(r => r.data);

// ─── Notifications ────────────────────────────────────────────────────────────
export const getNotifications       = ()   => api.get('/students/me/notifications').then(r => r.data);
export const markNotificationRead   = (id) => api.patch(`/students/me/notifications/${id}/read`).then(r => r.data);
export const markAllNotificationsRead = () => api.patch('/students/me/notifications/read-all').then(r => r.data);

// ─── Resumes ──────────────────────────────────────────────────────────────────
export const getResumes    = ()   => api.get('/students/me/resumes').then(r => r.data);
export const deleteResume  = (id) => api.delete(`/students/me/resumes/${id}`).then(r => r.data);

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const getCompanyReviews = (companyId) => api.get('/reviews', { params: { companyId } }).then(r => r.data);
export const createReview      = (data)      => api.post('/reviews', data).then(r => r.data);

// ─── Resources ────────────────────────────────────────────────────────────────
export const getResources = (params) => api.get('/resources', { params }).then(r => r.data);
