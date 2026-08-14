import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const portalPaths = { student: '/dashboard', company: '/company/portal', admin: '/admin/portal' };

export default function AuthForm({ mode, role = 'student' }) {
  const isRegister = mode === 'register';
  const roleLabel = role[0].toUpperCase() + role.slice(1);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true); setError('');
    try {
      await (isRegister ? register(form, role) : login(form, role));
      navigate(portalPaths[role]);
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to continue. Please try again.'); }
    finally { setSubmitting(false); }
  }

  return <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
    <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">{roleLabel} access</p>
    <h1 className="mt-3 text-3xl font-bold">{isRegister ? 'Create your account' : `Welcome back, ${role.toLowerCase()}`}</h1>
    <p className="mt-2 text-sm text-slate-600">{isRegister ? `Create a ${role.toLowerCase()} account to continue.` : `Log in to access the ${role.toLowerCase()} portal.`}</p>
    <form className="mt-7 space-y-4" onSubmit={submit}>
      {isRegister && <label className="block text-sm font-medium">Name<input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" /></label>}
      <label className="block text-sm font-medium">Email<input required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" /></label>
      <label className="block text-sm font-medium">Password<input required minLength="8" type="password" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" /></label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={submitting} className="w-full rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white disabled:opacity-60">{submitting ? 'Please wait...' : isRegister ? `Create ${role.toLowerCase()} account` : `Log in to ${role.toLowerCase()} portal`}</button>
    </form>
    {role === 'student' && <p className="mt-5 text-center text-sm text-slate-600">{isRegister ? 'Already have an account?' : 'New to Smart Internship Finder?'} <Link className="font-semibold text-emerald-700" to={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Create one'}</Link></p>}
  </div>;
}
