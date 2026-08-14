import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-8 text-center text-slate-500">Checking your session…</p>;
  return user && allowedRoles.includes(user.role) ? children : <Navigate to="/login" replace />;
}
