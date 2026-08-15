import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchInternships, fetchLocationStats } from '../services/internshipService';
import { getMyApplications, getSaved } from '../services/studentService';
import {
  Sparkles, Briefcase, Bookmark, MapPin, TrendingUp,
  ArrowRight, Clock, Building2, DollarSign, Award, Zap,
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className={`rounded-2xl p-5 ${color} flex items-start gap-4`}>
      <div className="rounded-xl bg-white/30 p-2.5">
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-3xl font-extrabold text-white">{value}</p>
        <p className="text-sm font-semibold text-white/90">{label}</p>
        {sub && <p className="mt-1 text-xs text-white/70">{sub}</p>}
      </div>
    </div>
  );
}

function InternshipMiniCard({ internship }) {
  const company = internship.companyId;
  return (
    <Link
      to="/internships"
      className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 hover:shadow-md hover:border-emerald-200 transition-all group"
    >
      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shrink-0">
        {company?.logo
          ? <img src={company.logo} alt={company.name} className="h-8 w-8 object-contain rounded" />
          : <Building2 size={20} className="text-emerald-700" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 truncate text-sm group-hover:text-emerald-700 transition">{internship.title}</p>
        <p className="text-xs text-slate-500 truncate">{company?.name}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <MapPin size={10} /> {internship.location}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            internship.compensationType === 'Paid'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-slate-100 text-slate-500'
          }`}>
            {internship.compensationType === 'Paid' ? `₹${internship.stipend?.toLocaleString()}/mo` : 'Unpaid'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {internship.aiMatch > 0 && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {internship.aiMatch}% match
          </span>
        )}
        <ArrowRight size={14} className="text-slate-300 group-hover:text-emerald-500 transition" />
      </div>
    </Link>
  );
}

function LocationBadge({ location, total }) {
  return (
    <Link
      to={`/internships?location=${location}`}
      className="flex items-center justify-between rounded-xl bg-white border border-slate-100 px-4 py-3 hover:border-emerald-300 hover:shadow-sm transition group"
    >
      <div className="flex items-center gap-2">
        <MapPin size={14} className="text-emerald-600" />
        <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-700">{location}</span>
      </div>
      <span className="text-xs font-bold text-white bg-emerald-600 rounded-full px-2.5 py-0.5">{total}</span>
    </Link>
  );
}

function AiMatchBanner({ name }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-6 text-white">
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -right-4 top-10 h-24 w-24 rounded-full bg-white/10" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={18} className="text-yellow-300" />
          <span className="text-xs font-bold tracking-widest uppercase text-white/80">AI Powered</span>
        </div>
        <h3 className="text-xl font-extrabold">Get Your AI Match Score</h3>
        <p className="mt-1 text-sm text-white/80 max-w-xs">
          Upload your resume and let our AI find internships tailored to your skills.
        </p>
        <Link
          to="/resume"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-sm font-bold text-purple-700 hover:bg-purple-50 transition"
        >
          <Zap size={14} /> Upload Resume
        </Link>
      </div>
    </div>
  );
}

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'there';

  const [internships, setInternships]   = useState([]);
  const [locations, setLocations]       = useState([]);
  const [applications, setApplications] = useState([]);
  const [saved, setSaved]               = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetchInternships({ limit: 6, sort: 'bestMatch' }),
      fetchLocationStats(),
      getMyApplications(),
      getSaved(),
    ]).then(([intRes, locRes, appRes, savRes]) => {
      if (intRes.status === 'fulfilled') setInternships(intRes.value.items || []);
      if (locRes.status === 'fulfilled') setLocations(locRes.value.slice(0, 6));
      if (appRes.status === 'fulfilled') setApplications(appRes.value);
      if (savRes.status === 'fulfilled') setSaved(savRes.value);
    }).finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest">{greeting}</p>
        <h1 className="mt-1 text-3xl font-extrabold text-slate-900">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="mt-1 text-slate-500">Here's what's happening with your internship journey.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Briefcase}  label="Applications"    value={loading ? '—' : applications.length}  color="bg-gradient-to-br from-emerald-500 to-emerald-700" />
        <StatCard icon={Bookmark}   label="Saved"           value={loading ? '—' : saved.length}         color="bg-gradient-to-br from-blue-500 to-blue-700" />
        <StatCard icon={TrendingUp} label="Open Listings"   value={loading ? '—' : internships.length}   color="bg-gradient-to-br from-violet-500 to-violet-700" />
        <StatCard icon={Award}      label="Profile Score"   value="72%"   sub="Add skills to improve"    color="bg-gradient-to-br from-orange-400 to-orange-600" />
      </div>

      {/* AI Banner + Locations */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AiMatchBanner name={firstName} />
        </div>
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">📍 Top Locations</h2>
          {loading
            ? Array(5).fill(0).map((_, i) => <div key={i} className="h-12 rounded-xl bg-slate-100 animate-pulse" />)
            : locations.map(l => <LocationBadge key={l.location} location={l.location} total={l.total} />)
          }
          <Link to="/internships" className="flex items-center gap-1 text-xs text-emerald-600 font-semibold hover:underline pt-1">
            View all locations <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Recent Internships */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">🔥 Recommended for You</h2>
          <Link to="/internships" className="flex items-center gap-1 text-sm text-emerald-600 font-semibold hover:underline">
            See all <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {Array(6).fill(0).map((_, i) => <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {internships.map(i => <InternshipMiniCard key={i._id} internship={i} />)}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { to: '/resume',         icon: '📄', label: 'Upload Resume',       color: 'from-blue-50 to-blue-100 border-blue-200 text-blue-700' },
          { to: '/profile',        icon: '👤', label: 'Complete Profile',     color: 'from-violet-50 to-violet-100 border-violet-200 text-violet-700' },
          { to: '/applications',   icon: '📋', label: 'Track Applications',   color: 'from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700' },
          { to: '/resources',      icon: '📚', label: 'Browse Resources',     color: 'from-orange-50 to-orange-100 border-orange-200 text-orange-700' },
        ].map(({ to, icon, label, color }) => (
          <Link key={to} to={to}
            className={`flex flex-col items-center justify-center gap-2 rounded-2xl border bg-gradient-to-br ${color} p-5 text-center hover:shadow-md transition`}
          >
            <span className="text-2xl">{icon}</span>
            <span className="text-xs font-bold">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
