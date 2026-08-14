import { GraduationCap } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const studentLinks = [
  ['Home', '/'], ['Internships', '/internships'], ['Search By', '/search-by'], ['Locations', '/locations'], ['Dream Company', '/dream-company'], ['Resources', '/resources'], ['Create Resume AI', '/resume/create'], ['Upload Resume', '/resume/upload'], ['Student Profile', '/profile']
];

export default function Header() {
  const { user, logout } = useAuth();
  const portalPath = user?.role === 'company' ? '/company/portal' : user?.role === 'admin' ? '/admin/portal' : '/dashboard';
  return <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center gap-x-6 px-6 py-3"><Link to="/" className="flex shrink-0 items-center gap-2 font-bold text-emerald-700"><GraduationCap size={24} /> Smart Internship Finder</Link>{!user || user.role === 'student' ? <nav aria-label="Student navigation" className="order-3 flex w-full gap-x-4 overflow-x-auto border-t border-slate-100 pt-3 text-xs font-medium text-slate-600 xl:order-2 xl:w-auto xl:flex-1 xl:border-0 xl:pt-0">{studentLinks.map(([label, path]) => <NavLink key={path} to={path} className={({ isActive }) => `whitespace-nowrap ${isActive ? 'font-bold text-emerald-700' : 'hover:text-emerald-700'}`}>{label}</NavLink>)}</nav> : null}<div className="ml-auto flex shrink-0 items-center gap-4 text-sm">{user ? <><Link className="font-medium text-slate-600" to={portalPath}>{user.role === 'student' ? 'Dashboard' : 'Portal'}</Link><button onClick={logout} className="font-semibold text-emerald-700">Log out</button></> : <><Link className="text-slate-600" to="/login">Student login</Link><Link className="rounded-md bg-emerald-700 px-3 py-2 font-semibold text-white" to="/register">Create account</Link></>}</div></div></header>;
}
