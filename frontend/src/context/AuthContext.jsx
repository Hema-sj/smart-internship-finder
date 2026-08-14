import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/auth/me').then(({ data }) => setUser(data.user)).catch(() => setUser(null)).finally(() => setLoading(false)); }, []);
  const completeAuth = (data) => setUser(data.user);
  const login = async (payload, role = 'student') => { const { data } = await api.post(role === 'company' ? '/auth/company/login' : role === 'admin' ? '/auth/admin/login' : '/auth/login', payload); completeAuth(data); return data; };
  const register = async (payload, role = 'student') => { const { data } = await api.post(role === 'company' ? '/auth/company/register' : '/auth/register', payload); completeAuth(data); return data; };
  const logout = async () => { try { await api.post('/auth/logout'); } finally { setUser(null); } };
  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
