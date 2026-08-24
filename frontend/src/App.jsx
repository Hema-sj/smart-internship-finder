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
import LocationPage            from './pages/LocationPage';
import CompanyProfilePage      from './pages/CompanyProfilePage';
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
import ResumeUploadPage        from './pages/ResumeUploadPage';
import ResumeAnalysisPage      from './pages/ResumeAnalysisPage';
import AIResumeBuilderPage     from './pages/AIResumeBuilderPage';
import ResumePreviewPage       from './pages/ResumePreviewPage';
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
          <Route path="/locations/:location" element={<LocationPage />} />
          <Route path="/company/:id"    element={<CompanyProfilePage />} />
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
          <Route path="/dashboard"               element={<StudentDashboardPage />} />
          <Route path="/dashboard/applications"  element={<ApplicationsPage />} />
          <Route path="/dashboard/saved"         element={<SavedPage />} />
          <Route path="/dashboard/profile"       element={<ProfilePage />} />
          <Route path="/dashboard/resume"        element={<ResumePage />} />
          <Route path="/dashboard/resume/upload" element={<ResumeUploadPage />} />
          <Route path="/dashboard/resume/analysis/:id" element={<ResumeAnalysisPage />} />
          <Route path="/dashboard/resume/ai-builder" element={<AIResumeBuilderPage />} />
          <Route path="/dashboard/resume/preview/:id" element={<ResumePreviewPage />} />
          <Route path="/dashboard/resources"     element={<ResourcesPage />} />
          <Route path="/dashboard/notifications" element={<NotificationsPage />} />
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
