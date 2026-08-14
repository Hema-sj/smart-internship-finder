import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) { const { user, loading } = useAuth(); if (loading) return <p className="p-8 text-center text-slate-500">Checking your session…</p>; return user ? children : <Navigate to="/login" replace />; }
