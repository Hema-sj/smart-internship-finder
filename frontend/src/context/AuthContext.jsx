import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [profile, setProfile]   = useState(null);   // studentProfile or company object
  const [loading, setLoading]   = useState(true);

  const hydrateFromData = useCallback((data) => {
    setUser(data.user);
    setProfile(data.studentProfile || data.company || null);
  }, []);

  useEffect(() => {
    api.get('/auth/me')
      .then(({ data }) => hydrateFromData(data))
      .catch(() => { setUser(null); setProfile(null); })
      .finally(() => setLoading(false));
  }, [hydrateFromData]);

  const login = async (payload, role = 'student') => {
    const endpoint = role === 'company' ? '/auth/company/login'
                   : role === 'admin'   ? '/auth/admin/login'
                   : '/auth/login';
    const { data } = await api.post(endpoint, payload);
    hydrateFromData(data);
    return data;
  };

  const register = async (payload, role = 'student') => {
    const endpoint = role === 'company' ? '/auth/company/register' : '/auth/register';
    const { data } = await api.post(endpoint, payload);
    hydrateFromData(data);
    return data;
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } finally {
      setUser(null);
      setProfile(null);
      localStorage.removeItem('token'); // Clear token from localStorage
    }
  };

  const refreshProfile = async () => {
    try {
      const { data } = await api.get('/auth/me');
      hydrateFromData(data);
    } catch (_) {}
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
