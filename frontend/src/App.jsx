import { Routes, Route } from 'react-router-dom';
import { AuthProvider }         from './context/AuthContext';

// Layouts
import AppLayout               from './layouts/AppLayout';
import DashboardLayout         from './layouts/DashboardLayout';

// Auth guards
import ProtectedRoute          from './components/ProtectedRoute';
import RoleProtectedRoute      from './components/RoleProtectedRoute';

// Public pages
import HomePage                from './pages/HomePage';
import InternshipListPage      from './pages/InternshipListPage';
import InternshipDetailPage    from './pages/InternshipDetailPage';
import Locations               from './pages/Locations';
import LoginPage               from './pages/LoginPage';
import RegisterPage            from './pages/RegisterPage';
import CompanyLoginPage        from './pages/CompanyLoginPage';
import CompanyRegisterPage     from './pages/CompanyRegisterPage';
import AdminLoginPage          from './pages/AdminLoginPage';
import NotFoundPage            from './pages/NotFoundPage';

// Student dashboard pages
import StudentDashboardPage    from './pages/StudentDashboardPage';
import ApplicationsPage        from './pages/ApplicationsPage';
import SavedPage               from './pages/SavedPage';
import ProfilePage             from './pages/ProfilePage';
import ResumePage              from './pages/ResumePage';
import ResourcesPage           from './pages/ResourcesPage';
import NotificationsPage       from './pages/NotificationsPage';

// Company / Admin portals
import CompanyPortalPage       from './pages/CompanyPortalPage';
import AdminPortalPage         from './pages/AdminPortalPage';

// Auth wrapper for student dashboard
function StudentRoute({ children }) {
  return (
    <ProtectedRoute>
      <RoleProtectedRoute allowedRoles={['student']}>
        {children}
      </RoleProtectedRoute>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ── Public pages (top navbar) ── */}
        <Route element={<AppLayout />}>
          <Route path="/"               element={<HomePage />} />
          <Route path="/internships"    element={<InternshipListPage />} />
          <Route path="/internships/:id" element={<InternshipDetailPage />} />
          <Route path="/locations"      element={<Locations />} />
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/register"       element={<RegisterPage />} />
          <Route path="/company/login"  element={<CompanyLoginPage />} />
          <Route path="/company/register" element={<CompanyRegisterPage />} />
          <Route path="/admin/login"    element={<AdminLoginPage />} />
        </Route>

        {/* ── Student Dashboard (sidebar layout) ── */}
        <Route element={
          <StudentRoute>
            <DashboardLayout />
          </StudentRoute>
        }>
          <Route path="/dashboard"      element={<StudentDashboardPage />} />
          <Route path="/applications"   element={<ApplicationsPage />} />
          <Route path="/saved"          element={<SavedPage />} />
          <Route path="/profile"        element={<ProfilePage />} />
          <Route path="/resume"         element={<ResumePage />} />
          <Route path="/resources"      element={<ResourcesPage />} />
          <Route path="/notifications"  element={<NotificationsPage />} />
        </Route>

        {/* ── Company portal ── */}
        <Route element={<AppLayout />}>
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
