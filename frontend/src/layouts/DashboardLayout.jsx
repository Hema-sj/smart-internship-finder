import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Search, Bookmark, FileText, Bell,
  UserCircle, BookOpen, Briefcase, LogOut,
  GraduationCap, Menu, X, MapPin,
} from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { to: '/dashboard',       icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/internships',     icon: Search,           label: 'Internships' },
  { to: '/locations',       icon: MapPin,           label: 'Locations' },
  { to: '/applications',    icon: Briefcase,        label: 'Applications' },
  { to: '/saved',           icon: Bookmark,         label: 'Saved' },
  { to: '/profile',         icon: UserCircle,       label: 'Profile' },
  { to: '/resume',          icon: FileText,         label: 'Resume Builder' },
  { to: '/resources',       icon: BookOpen,         label: 'Resources' },
  { to: '/notifications',   icon: Bell,             label: 'Notifications' },
];

function SidebarLink({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      end={to === '/dashboard'}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
         ${isActive
           ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
           : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`
      }
    >
      <Icon size={18} className="shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
}

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const Sidebar = ({ mobile = false }) => (
    <aside className={`flex flex-col h-full bg-white border-r border-slate-200 ${mobile ? 'w-full' : 'w-64'}`}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
          <GraduationCap size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 leading-tight">Smart Intern</p>
          <p className="text-xs text-slate-400">Student Portal</p>
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-slate-400 hover:text-slate-700">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map(item => (
          <SidebarLink key={item.to} {...item} onClick={() => mobile && setSidebarOpen(false)} />
        ))}
      </nav>

      {/* User Footer */}
      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="shrink-0 text-slate-400 hover:text-red-500 transition"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:shrink-0">
        <div className="w-64 flex flex-col h-full">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col shadow-2xl">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-3 bg-white border-b border-slate-200 px-4 py-3">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-600 hover:text-slate-900">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <GraduationCap size={18} className="text-emerald-600" />
            <span className="text-sm font-bold text-slate-900">Smart Intern</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <NavLink to="/notifications" className="relative text-slate-500 hover:text-slate-900">
              <Bell size={20} />
            </NavLink>
            <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
