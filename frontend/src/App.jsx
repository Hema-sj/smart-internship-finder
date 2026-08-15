import { Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import CompanyPortalPage from './pages/CompanyPortalPage';
import AdminPortalPage from './pages/AdminPortalPage';
import CompanyLoginPage from './pages/CompanyLoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import CompanyRegisterPage from './pages/CompanyRegisterPage';
import FeaturePlaceholderPage from './pages/FeaturePlaceholderPage';
import InternshipListPage from './pages/InternshipListPage';
import LocationsPage from './pages/LocationsPage';

const studentFeature = (title, description) => (
  <ProtectedRoute>
    <RoleProtectedRoute allowedRoles={['student']}>
      <FeaturePlaceholderPage title={title} description={description} />
    </RoleProtectedRoute>
  </ProtectedRoute>
);

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Public */}
          <Route path="/"               element={<HomePage />} />
          <Route path="/internships"    element={<InternshipListPage />} />
          <Route path="/locations"      element={<LocationsPage />} />
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/register"       element={<RegisterPage />} />
          <Route path="/company/login"  element={<CompanyLoginPage />} />
          <Route path="/company/register" element={<CompanyRegisterPage />} />
          <Route path="/admin/login"    element={<AdminLoginPage />} />

          {/* Student-protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={['student']}>
                <StudentDashboardPage />
              </RoleProtectedRoute>
            </ProtectedRoute>
          } />
          <Route path="/search-by"     element={studentFeature('Search By',       'Search internship opportunities by role, skill, company, or compensation type.')} />
          <Route path="/dream-company" element={studentFeature('Dream Company',    'Discover the skills and experiences to prioritize for your target company.')} />
          <Route path="/resources"     element={studentFeature('Resources',        'Find learning resources matched to your career goals and skill gaps.')} />
          <Route path="/resume/create" element={studentFeature('Create Resume AI', 'Create an engineering-focused resume with AI guidance.')} />
          <Route path="/resume/upload" element={studentFeature('Upload Resume',    'Upload a resume for skill extraction and personalized matching.')} />
          <Route path="/profile"       element={studentFeature('Student Profile',  'Manage your academic profile, skills, interests, and dream company.')} />

          {/* Company / Admin portals */}
          <Route path="/company/portal" element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={['company', 'admin']}>
                <CompanyPortalPage />
              </RoleProtectedRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin/portal" element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminPortalPage />
              </RoleProtectedRoute>
            </ProtectedRoute>
          } />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
