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

export default function App() { return <AuthProvider><Routes><Route element={<AppLayout />}><Route path="/" element={<HomePage />} /><Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} /><Route path="/company/register" element={<CompanyRegisterPage />} /><Route path="/company/login" element={<CompanyLoginPage />} /><Route path="/admin/login" element={<AdminLoginPage />} /><Route path="/dashboard" element={<ProtectedRoute><RoleProtectedRoute allowedRoles={['student']}><StudentDashboardPage /></RoleProtectedRoute></ProtectedRoute>} /><Route path="/company/portal" element={<ProtectedRoute><RoleProtectedRoute allowedRoles={['company', 'admin']}><CompanyPortalPage /></RoleProtectedRoute></ProtectedRoute>} /><Route path="/admin/portal" element={<ProtectedRoute><RoleProtectedRoute allowedRoles={['admin']}><AdminPortalPage /></RoleProtectedRoute></ProtectedRoute>} /></Route><Route path="*" element={<NotFoundPage />} /></Routes></AuthProvider>; }
