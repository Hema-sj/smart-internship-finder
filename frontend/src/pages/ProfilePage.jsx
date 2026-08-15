import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyProfile, updateMyProfile } from '../services/studentService';
import { User, GraduationCap, MapPin, Star, Plus, X, Loader2, CheckCircle2 } from 'lucide-react';

const DEGREES  = ['B.E.', 'B.Tech', 'M.Tech', 'M.E.', 'BCA', 'MCA', 'B.Sc', 'M.Sc', 'MBA', 'B.Com', 'Other'];
const BRANCHES = ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'IT', 'AIDS', 'AIML', 'Data Science', 'Other'];
const YEARS    = [1, 2, 3, 4, 5];

function Tag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
      {label}
      {onRemove && (
        <button onClick={onRemove} className="text-emerald-400 hover:text-red-500 transition">
          <X size={11} />
        </button>
      )}
    </span>
  );
}

function FieldRow({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const input = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition';

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [form, setForm]         = useState({});
  const [newInterest, setNewInterest] = useState('');
  const [newSkill, setNewSkill]       = useState('');

  useEffect(() => {
    getMyProfile().then(p => {
      setProfile(p);
      setForm({
        phone:       p.phone       || '',
        college:     p.college     || '',
        degree:      p.degree      || '',
        branch:      p.branch      || '',
        year:        p.year        || '',
        cgpa:        p.cgpa        || '',
        location:    p.location    || '',
        dreamCompany:p.dreamCompany|| '',
        interests:   p.interests   || [],
      });
    }).finally(() => setLoading(false));
  }, []);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const addInterest = () => {
    if (!newInterest.trim()) return;
    setForm(f => ({ ...f, interests: [...(f.interests || []), newInterest.trim()] }));
    setNewInterest('');
  };

  const removeInterest = (i) => setForm(f => ({ ...f, interests: f.interests.filter((_, idx) => idx !== i) }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMyProfile(form);
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to save profile');
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={28} className="animate-spin text-emerald-600" />
    </div>
  );

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Keep your profile updated for better AI matches.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition disabled:opacity-60"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <CheckCircle2 size={15} /> : null}
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Avatar Block */}
      <div className="flex items-center gap-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-5">
        <div className="h-16 w-16 rounded-full bg-emerald-600 text-white text-xl font-extrabold flex items-center justify-center shrink-0">
          {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        <div>
          <p className="text-lg font-extrabold text-slate-900">{user?.name}</p>
          <p className="text-sm text-slate-500">{user?.email}</p>
          <span className="inline-block mt-1 text-xs font-bold rounded-full bg-emerald-600 text-white px-3 py-0.5 capitalize">{user?.role}</span>
        </div>
      </div>

      {/* Academic Info */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-800"><GraduationCap size={18} className="text-emerald-600" /> Academic Details</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <FieldRow label="College / University">
            <input className={input} value={form.college} onChange={set('college')} placeholder="Anna University" />
          </FieldRow>
          <FieldRow label="Degree">
            <select className={input} value={form.degree} onChange={set('degree')}>
              <option value="">Select degree</option>
              {DEGREES.map(d => <option key={d}>{d}</option>)}
            </select>
          </FieldRow>
          <FieldRow label="Branch / Specialisation">
            <select className={input} value={form.branch} onChange={set('branch')}>
              <option value="">Select branch</option>
              {BRANCHES.map(b => <option key={b}>{b}</option>)}
            </select>
          </FieldRow>
          <FieldRow label="Current Year">
            <select className={input} value={form.year} onChange={set('year')}>
              <option value="">Select year</option>
              {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </FieldRow>
          <FieldRow label="CGPA / Percentage">
            <input type="number" min="0" max="10" step="0.1" className={input} value={form.cgpa} onChange={set('cgpa')} placeholder="8.5" />
          </FieldRow>
          <FieldRow label="Phone Number">
            <input className={input} value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
          </FieldRow>
        </div>
      </div>

      {/* Personal Info */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-800"><MapPin size={18} className="text-emerald-600" /> Personal Details</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <FieldRow label="Preferred Location">
            <input className={input} value={form.location} onChange={set('location')} placeholder="Chennai" />
          </FieldRow>
          <FieldRow label="Dream Company">
            <input className={input} value={form.dreamCompany} onChange={set('dreamCompany')} placeholder="Google, Zoho…" />
          </FieldRow>
        </div>
        <FieldRow label="Interests">
          <div className="flex flex-wrap gap-2 mb-2">
            {(form.interests || []).map((int, i) => (
              <Tag key={i} label={int} onRemove={() => removeInterest(i)} />
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className={input + ' flex-1'}
              value={newInterest}
              onChange={e => setNewInterest(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addInterest()}
              placeholder="Add interest (press Enter)"
            />
            <button onClick={addInterest} className="rounded-xl bg-emerald-600 px-4 text-white hover:bg-emerald-700 transition">
              <Plus size={16} />
            </button>
          </div>
        </FieldRow>
      </div>
    </div>
  );
}
