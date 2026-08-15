import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSaved, unsaveInternship, applyToInternship } from '../services/studentService';
import { Bookmark, Building2, MapPin, Calendar, DollarSign, Trash2, Send, Loader2 } from 'lucide-react';

function SavedCard({ item, onUnsave, onApply }) {
  const internship = item.internshipId;
  const company    = internship?.companyId;
  const [busy, setBusy] = useState(false);

  const handleUnsave = async () => {
    setBusy(true);
    try { await onUnsave(item._id); } finally { setBusy(false); }
  };

  const handleApply = async () => {
    setBusy(true);
    try { await onApply(internship._id); } catch (e) {
      alert(e?.response?.data?.message || 'Could not apply');
    } finally { setBusy(false); }
  };

  if (!internship) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-md transition">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
          {company?.logo
            ? <img src={company.logo} alt={company.name} className="h-9 w-9 object-contain" />
            : <Building2 size={22} className="text-emerald-700" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900">{internship.title}</h3>
          <p className="text-sm text-slate-500">{company?.name}</p>
          <div className="flex flex-wrap gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-slate-400"><MapPin size={11} />{internship.location}</span>
            <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${
              internship.compensationType === 'Paid'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-500'
            }`}>
              {internship.compensationType === 'Paid' ? `₹${internship.stipend?.toLocaleString()}/mo` : 'Unpaid'}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar size={11} />Deadline: {new Date(internship.applicationDeadline).toLocaleDateString('en-IN')}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <span className="text-xs text-slate-400">Saved {new Date(item.savedAt).toLocaleDateString('en-IN')}</span>
        <div className="flex gap-2">
          <button onClick={handleUnsave} disabled={busy}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-red-500 hover:border-red-200 transition disabled:opacity-50">
            <Trash2 size={12} /> Remove
          </button>
          <button onClick={handleApply} disabled={busy}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition disabled:opacity-50">
            <Send size={12} /> Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SavedPage() {
  const [saved, setSaved]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [applied, setApplied]   = useState(new Set());

  useEffect(() => {
    getSaved().then(setSaved).finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (id) => {
    await unsaveInternship(id);
    setSaved(prev => prev.filter(s => s._id !== id));
  };

  const handleApply = async (internshipId) => {
    await applyToInternship(internshipId);
    setApplied(prev => new Set([...prev, internshipId]));
    alert('Applied successfully! 🎉');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Saved Internships</h1>
        <p className="text-slate-500 text-sm mt-1">Internships you've bookmarked for later.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-emerald-600" />
        </div>
      ) : saved.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Bookmark size={44} className="mb-3 text-slate-300" />
          <p className="font-semibold text-slate-600 text-lg">No saved internships yet</p>
          <p className="text-sm mt-1 mb-6">Browse and save internships you're interested in.</p>
          <Link to="/internships"
            className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition">
            Browse Internships
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">{saved.length} saved internship{saved.length !== 1 ? 's' : ''}</p>
          {saved.map(item => (
            <SavedCard key={item._id} item={item} onUnsave={handleUnsave} onApply={handleApply} />
          ))}
        </div>
      )}
    </div>
  );
}
