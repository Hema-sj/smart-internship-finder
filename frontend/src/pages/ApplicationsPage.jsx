import { useEffect, useState } from 'react';
import { getMyApplications, withdrawApplication } from '../services/studentService';
import { Briefcase, Clock, CheckCircle2, XCircle, AlertCircle, ChevronDown, Loader2, Building2, MapPin, Calendar } from 'lucide-react';

const STATUS_STYLES = {
  'Applied':      'bg-blue-50 text-blue-700 border-blue-200',
  'Under Review': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Shortlisted':  'bg-purple-50 text-purple-700 border-purple-200',
  'Interview':    'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Selected':     'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Rejected':     'bg-red-50 text-red-700 border-red-200',
};

const STATUS_ICONS = {
  'Applied':      Clock,
  'Under Review': AlertCircle,
  'Shortlisted':  ChevronDown,
  'Interview':    AlertCircle,
  'Selected':     CheckCircle2,
  'Rejected':     XCircle,
};

function StatusBadge({ status }) {
  const Icon = STATUS_ICONS[status] || Clock;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-600'}`}>
      <Icon size={12} /> {status}
    </span>
  );
}

function ApplicationCard({ app, onWithdraw }) {
  const internship = app.internshipId;
  const company = internship?.companyId;
  const [withdrawing, setWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    if (!confirm('Withdraw this application?')) return;
    setWithdrawing(true);
    try { await onWithdraw(app._id); }
    finally { setWithdrawing(false); }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-md transition group">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shrink-0">
          {company?.logo
            ? <img src={company.logo} alt={company.name} className="h-9 w-9 object-contain rounded" />
            : <Building2 size={22} className="text-emerald-700" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 truncate">{internship?.title || 'Internship'}</h3>
          <p className="text-sm text-slate-500">{company?.name}</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {internship?.location && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <MapPin size={11} /> {internship.location}
              </span>
            )}
            {app.appliedDate && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar size={11} /> Applied {new Date(app.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            )}
          </div>
        </div>
        <StatusBadge status={app.status} />
      </div>
      {app.status === 'Applied' && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleWithdraw}
            disabled={withdrawing}
            className="text-xs text-red-500 hover:text-red-700 font-semibold disabled:opacity-50 transition"
          >
            {withdrawing ? 'Withdrawing…' : 'Withdraw Application'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  const [apps, setApps]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('All');

  useEffect(() => {
    getMyApplications().then(setApps).finally(() => setLoading(false));
  }, []);

  const handleWithdraw = async (id) => {
    await withdrawApplication(id);
    setApps(prev => prev.filter(a => a._id !== id));
  };

  const statuses = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];
  const filtered = filter === 'All' ? apps : apps.filter(a => a.status === filter);

  const counts = statuses.reduce((acc, s) => {
    acc[s] = s === 'All' ? apps.length : apps.filter(a => a.status === s).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">My Applications</h1>
        <p className="text-slate-500 text-sm mt-1">Track the status of all your internship applications.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {['Applied','Under Review','Shortlisted','Interview','Selected','Rejected'].map(s => (
          <div key={s} className={`rounded-xl p-3 text-center border ${STATUS_STYLES[s] || 'bg-slate-50 border-slate-200'}`}>
            <p className="text-xl font-extrabold">{counts[s]}</p>
            <p className="text-xs font-medium mt-0.5">{s}</p>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold border transition ${
              filter === s
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
            }`}
          >
            {s} {counts[s] > 0 && <span className="ml-1 opacity-70">({counts[s]})</span>}
          </button>
        ))}
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-emerald-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Briefcase size={40} className="mb-3 text-slate-300" />
          <p className="font-semibold text-slate-600">No applications yet</p>
          <p className="text-sm mt-1">Start applying to internships from the Internships page.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(app => (
            <ApplicationCard key={app._id} app={app} onWithdraw={handleWithdraw} />
          ))}
        </div>
      )}
    </div>
  );
}
