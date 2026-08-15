import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search, SlidersHorizontal, MapPin, BookOpen, Calendar,
  ChevronLeft, ChevronRight, Loader2, X, ArrowUpDown,
  Award, DollarSign, Building2, Star, Bookmark, Send,
  LayoutGrid, List, Filter, ChevronDown, ChevronUp, Sparkles,
} from 'lucide-react';
import { fetchInternships } from '../services/internshipService';

// ─── Constants ────────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: 'bestMatch',      label: '✦ Best Match' },
  { value: 'newest',         label: '🕐 Newest' },
  { value: 'startingSoon',   label: '⚡ Starting Soon' },
  { value: 'highestStipend', label: '💰 Highest Stipend' },
];

const COMP_OPTIONS = [
  { value: 'All',                  label: 'All',                  color: 'slate' },
  { value: 'Paid',                 label: '💰 Paid',               color: 'emerald' },
  { value: 'Unpaid',               label: '🎓 Unpaid',             color: 'blue' },
  { value: 'Stipend Not Disclosed',label: '🔒 Not Disclosed',      color: 'orange' },
];

const CERT_OPTIONS = [
  'All',
  'Hard Copy',
  'Soft Copy',
  'Both',
  'No Certificate',
  'Not Disclosed',
];

const LOCATIONS = [
  'Chennai', 'Bangalore', 'Coimbatore', 'Hyderabad',
  'Pune', 'Mumbai', 'Delhi', 'Kochi', 'Remote',
];

const COURSES = [
  'Software Engineering', 'Data Science', 'Frontend Development',
  'Backend Development', 'Machine Learning', 'Cloud Engineering',
  'Product Design', 'AI Research', 'DevOps', 'Mobile Development',
  'Business Analytics', 'Cybersecurity',
];

const PAGE_SIZE = 12;

// ─── Sub-components ───────────────────────────────────────────────────────────

function CompTab({ option, active, onClick }) {
  const colors = {
    emerald: active ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-700 hover:bg-emerald-50',
    blue:    active ? 'bg-blue-600 text-white shadow-sm'    : 'text-blue-700 hover:bg-blue-50',
    orange:  active ? 'bg-orange-500 text-white shadow-sm'  : 'text-orange-700 hover:bg-orange-50',
    slate:   active ? 'bg-slate-800 text-white shadow-sm'   : 'text-slate-700 hover:bg-slate-100',
  };
  return (
    <button
      id={`comp-tab-${option.value.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={() => onClick(option.value)}
      className={`rounded-xl px-4 py-2 text-sm font-bold transition-all whitespace-nowrap ${colors[option.color]}`}
    >
      {option.label}
    </button>
  );
}

function FilterSelect({ icon: Icon, label, value, onChange, options, placeholder }) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition cursor-pointer">
      <Icon size={15} className="shrink-0 text-slate-400" />
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm text-slate-700 outline-none cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function ActiveFilterPill({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 rounded-full hover:bg-emerald-100 p-0.5 transition"
        aria-label={`Remove ${label} filter`}
      >
        <X size={10} />
      </button>
    </span>
  );
}

function Pagination({ page, pages, total, limit, onPage }) {
  if (pages <= 1) return null;
  const range = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(pages, page + 2); i++) range.push(i);
  const from = (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center gap-3 pt-2">
      <nav aria-label="Pagination" className="flex items-center gap-1.5">
        <button
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {range[0] > 1 && <span className="px-1 text-slate-400 text-sm">…</span>}
        {range.map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-bold transition ${
              p === page
                ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700'
            }`}
          >
            {p}
          </button>
        ))}
        {range[range.length - 1] < pages && <span className="px-1 text-slate-400 text-sm">…</span>}
        <button
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </nav>
      <p className="text-xs text-slate-400">
        Showing {from}–{to} of {total} internships · Page {page} of {pages}
      </p>
    </div>
  );
}

// ─── Internship Card ──────────────────────────────────────────────────────────
function InternshipCard({ internship, onView, view }) {
  const company = internship.companyId || internship.company || {};
  const skills  = internship.requiredSkills || [];

  const stipendLabel = internship.compensationType === 'Paid'
    ? `₹${(internship.stipend || 0).toLocaleString('en-IN')}/mo`
    : internship.compensationType === 'Unpaid'
    ? 'Unpaid'
    : 'Stipend N/D';

  const stipendColor = internship.compensationType === 'Paid'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : internship.compensationType === 'Unpaid'
    ? 'bg-blue-50 text-blue-700 border-blue-200'
    : 'bg-orange-50 text-orange-700 border-orange-200';

  const certLabel = internship.certificateType;

  if (view === 'list') {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-md hover:border-emerald-200 transition group cursor-pointer" onClick={() => onView(internship)}>
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shrink-0">
          {company.logo
            ? <img src={company.logo} alt={company.name} className="h-9 w-9 object-contain rounded" />
            : <Building2 size={20} className="text-emerald-700" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 truncate group-hover:text-emerald-700 transition">{internship.title}</h3>
              <p className="text-sm text-slate-500 truncate">{company.name} · {internship.location}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {internship.aiMatch > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-violet-50 border border-violet-200 px-2.5 py-0.5 text-xs font-bold text-violet-700">
                  <Sparkles size={10} />{internship.aiMatch}%
                </span>
              )}
              <span className={`rounded-full border px-3 py-0.5 text-xs font-bold ${stipendColor}`}>{stipendLabel}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1.5">
            <span className="text-xs text-slate-400">{internship.duration}</span>
            <span className="text-xs text-slate-400">📜 {certLabel}</span>
            {skills.slice(0, 3).map(s => (
              <span key={s._id} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{s.name}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <article
      onClick={() => onView(internship)}
      className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-lg hover:border-emerald-200 transition-all group cursor-pointer relative overflow-hidden"
    >
      {internship.aiMatch > 0 && (
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1 rounded-full bg-violet-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            <Sparkles size={10} />{internship.aiMatch}% match
          </span>
        </div>
      )}

      {/* Company */}
      <div className="flex items-start gap-3 mb-4">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shrink-0">
          {company.logo
            ? <img src={company.logo} alt={company.name} className="h-9 w-9 object-contain rounded" />
            : <Building2 size={20} className="text-emerald-700" />}
        </div>
        <div className="min-w-0 pr-14">
          <h3 className="font-bold text-slate-900 truncate group-hover:text-emerald-700 transition">{internship.title}</h3>
          <p className="text-sm text-slate-500 truncate">{company.name}</p>
          {company.rating > 0 && (
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="text-xs text-slate-500">{company.rating?.toFixed(1)} ({company.reviewCount})</span>
            </div>
          )}
        </div>
      </div>

      {/* Meta chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
          <MapPin size={10} className="text-emerald-600" />{internship.location}
        </span>
        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${stipendColor}`}>
          {stipendLabel}
        </span>
        {internship.duration && (
          <span className="rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
            ⏱ {internship.duration}
          </span>
        )}
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skills.slice(0, 3).map(s => (
            <span key={s._id} className="rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              {s.name}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">+{skills.length - 3}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {certLabel && certLabel !== 'Not Disclosed' && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Award size={10} className="text-emerald-500" />{certLabel}
            </span>
          )}
          {internship.startDate && (
            <span className="text-xs text-slate-400">
              From {new Date(internship.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
        <span className="text-xs font-bold text-emerald-700 group-hover:underline transition">View →</span>
      </div>
    </article>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function InternshipModal({ internship, onClose }) {
  const company = internship.companyId || internship.company || {};
  const skills  = internship.requiredSkills || [];

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const stipendLabel = internship.compensationType === 'Paid'
    ? `₹${(internship.stipend || 0).toLocaleString('en-IN')}/month`
    : internship.compensationType;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-white border-b border-slate-100 p-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shrink-0">
              {company.logo
                ? <img src={company.logo} alt={company.name} className="h-11 w-11 object-contain rounded" />
                : <Building2 size={24} className="text-emerald-700" />}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{internship.title}</h2>
              <p className="text-slate-500 font-medium">{company.name}</p>
              {company.rating > 0 && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs text-slate-500">{company.rating?.toFixed(1)} · {company.reviewCount} reviews</span>
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100 transition text-slate-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              ['📍 Location',      internship.location],
              ['💰 Compensation',  stipendLabel],
              ['⏱ Duration',       internship.duration],
              ['📜 Certificate',   internship.certificateType],
              ['📚 Course',        internship.course],
              ['🗓 Start Date',    internship.startDate ? new Date(internship.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'],
              ['⏰ Deadline',       internship.applicationDeadline ? new Date(internship.applicationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'],
              ['🏢 Mode',          internship.mode ? internship.mode.charAt(0).toUpperCase() + internship.mode.slice(1) : '—'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500 font-semibold">{label}</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{value || '—'}</p>
              </div>
            ))}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => (
                  <span key={s._id} className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">{s.name}</span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {internship.description && (
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-2">About the Role</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{internship.description}</p>
            </div>
          )}

          {/* Company info */}
          {(company.description || company.website) && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
              <h3 className="text-sm font-bold text-emerald-800 mb-1">About {company.name}</h3>
              {company.description && <p className="text-sm text-emerald-700">{company.description}</p>}
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs font-bold text-emerald-700 hover:underline">
                  🌐 {company.website}
                </a>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="flex gap-3 pt-2">
            {internship.applicationUrl && (
              <a
                href={internship.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700 transition shadow-sm"
              >
                <Send size={16} /> Apply Now
              </a>
            )}
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 space-y-3 animate-pulse">
      <div className="flex gap-3">
        <div className="h-12 w-12 rounded-xl bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded-lg w-3/4" />
          <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-20 bg-slate-100 rounded-full" />
        <div className="h-6 w-16 bg-slate-100 rounded-full" />
      </div>
      <div className="h-3 bg-slate-100 rounded-lg w-full" />
      <div className="h-3 bg-slate-100 rounded-lg w-2/3" />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InternshipListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Filter state ──
  const [compensationType, setCompensationType] = useState(searchParams.get('comp') || 'All');
  const [certificateType,  setCertificateType]  = useState(searchParams.get('cert') || 'All');
  const [location,  setLocation]  = useState(searchParams.get('location') || '');
  const [course,    setCourse]    = useState(searchParams.get('course')   || '');
  const [startDate, setStartDate] = useState(searchParams.get('date')     || '');
  const [keyword,   setKeyword]   = useState(searchParams.get('q')        || '');
  const [inputVal,  setInputVal]  = useState(searchParams.get('q')        || '');
  const [sort,      setSort]      = useState(searchParams.get('sort')     || 'bestMatch');
  const [page,      setPage]      = useState(Number(searchParams.get('page')) || 1);
  const [view,      setView]      = useState('grid'); // 'grid' | 'list'
  const [advOpen,   setAdvOpen]   = useState(false);  // advanced filters panel

  // ── Data state ──
  const [items,      setItems]      = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: PAGE_SIZE });
  const [loading,    setLoading]    = useState(true);
  const [selected,   setSelected]   = useState(null);

  // ── Sync URL params ──
  useEffect(() => {
    const p = {};
    if (keyword)         p.q        = keyword;
    if (location)        p.location = location;
    if (course)          p.course   = course;
    if (startDate)       p.date     = startDate;
    if (sort !== 'bestMatch') p.sort = sort;
    if (compensationType !== 'All') p.comp = compensationType;
    if (certificateType  !== 'All') p.cert = certificateType;
    if (page > 1)        p.page     = page;
    setSearchParams(p, { replace: true });
  }, [keyword, location, course, startDate, sort, compensationType, certificateType, page]);

  // ── Debounce keyword ──
  const debounceRef = useRef(null);
  const handleKeywordChange = (val) => {
    setInputVal(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setKeyword(val); setPage(1); }, 450);
  };

  // ── Load data ──
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchInternships({
        page, limit: PAGE_SIZE, sort,
        compensationType, certificateType,
        location, course, startDate, keyword,
      });
      setItems(data.items || []);
      setPagination(data.pagination || { page, pages: 1, total: 0, limit: PAGE_SIZE });
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, sort, compensationType, certificateType, location, course, startDate, keyword]);

  useEffect(() => { load(); }, [load]);

  // ── Helpers ──
  const setF = (setter) => (val) => { setter(val); setPage(1); };

  const clearAll = () => {
    setCompensationType('All'); setCertificateType('All');
    setLocation(''); setCourse(''); setStartDate('');
    setKeyword(''); setInputVal(''); setSort('bestMatch'); setPage(1);
  };

  // ── Active filter pills ──
  const activeFilters = [
    compensationType !== 'All' && { label: `💰 ${compensationType}`,   remove: () => setF(setCompensationType)('All') },
    certificateType  !== 'All' && { label: `📜 ${certificateType}`,    remove: () => setF(setCertificateType)('All') },
    location         && { label: `📍 ${location}`,                      remove: () => setF(setLocation)('') },
    course           && { label: `📚 ${course}`,                        remove: () => setF(setCourse)('') },
    startDate        && { label: `📅 After ${new Date(startDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`, remove: () => setF(setStartDate)('') },
  ].filter(Boolean);

  const hasFilters = activeFilters.length > 0 || keyword;
  const pageTitle  = location ? `Internships in ${location}` : 'Internship Listings';

  return (
    <div className="space-y-5">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            {location ? `📍 ${location}` : 'Browse'}
          </p>
          <h1 className="mt-0.5 text-3xl font-extrabold text-slate-900">{pageTitle}</h1>
          {!loading && (
            <p className="mt-0.5 text-sm text-slate-500">
              {pagination.total.toLocaleString()} internship{pagination.total !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1">
          <button
            onClick={() => setView('grid')}
            className={`rounded-lg p-2 transition ${view === 'grid' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-700'}`}
            aria-label="Grid view"
          ><LayoutGrid size={16} /></button>
          <button
            onClick={() => setView('list')}
            className={`rounded-lg p-2 transition ${view === 'list' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-700'}`}
            aria-label="List view"
          ><List size={16} /></button>
        </div>
      </div>

      {/* ── Compensation tabs ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm w-fit">
          {COMP_OPTIONS.map(opt => (
            <CompTab
              key={opt.value}
              option={opt}
              active={compensationType === opt.value}
              onClick={setF(setCompensationType)}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown size={14} className="text-slate-400" />
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
            aria-label="Sort internships"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* ── Search bar + filter toggle ── */}
      <div className="flex gap-2">
        <label
          htmlFor="internship-search"
          className="flex flex-1 items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition"
        >
          <Search size={16} className="shrink-0 text-slate-400" />
          <input
            id="internship-search"
            type="search"
            placeholder="Search by role, company, skill, or keyword…"
            value={inputVal}
            onChange={(e) => handleKeywordChange(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
          />
          {inputVal && (
            <button onClick={() => handleKeywordChange('')} className="shrink-0 text-slate-400 hover:text-slate-600 transition">
              <X size={14} />
            </button>
          )}
        </label>
        <button
          onClick={() => setAdvOpen(v => !v)}
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm transition ${
            advOpen || activeFilters.some(f => ['📍','📚','📅','📜'].some(e => f.label.startsWith(e)))
              ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
              : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300'
          }`}
          aria-expanded={advOpen}
        >
          <Filter size={15} />
          <span className="hidden sm:inline">Filters</span>
          {activeFilters.length > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
              {activeFilters.length}
            </span>
          )}
          {advOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* ── Advanced filters panel ── */}
      {advOpen && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <FilterSelect
              icon={MapPin} label="Location" value={location}
              onChange={setF(setLocation)} options={LOCATIONS} placeholder="All locations"
            />
            <FilterSelect
              icon={BookOpen} label="Course" value={course}
              onChange={setF(setCourse)} options={COURSES} placeholder="All courses"
            />
            <FilterSelect
              icon={Award} label="Certificate" value={certificateType}
              onChange={setF(setCertificateType)}
              options={CERT_OPTIONS.filter(o => o !== 'All')} placeholder="Any certificate"
            />
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition cursor-pointer">
              <Calendar size={15} className="shrink-0 text-slate-400" />
              <input
                type="date"
                aria-label="Starting date filter"
                value={startDate}
                onChange={(e) => setF(setStartDate)(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-700 outline-none"
              />
            </label>
          </div>
          {hasFilters && (
            <button onClick={clearAll} className="text-xs font-bold text-red-500 hover:text-red-700 transition">
              ✕ Clear all filters
            </button>
          )}
        </div>
      )}

      {/* ── Active filter pills ── */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map(f => (
            <ActiveFilterPill key={f.label} label={f.label} onRemove={f.remove} />
          ))}
          <button onClick={clearAll} className="text-xs text-slate-400 hover:text-slate-600 underline transition">
            Clear all
          </button>
        </div>
      )}

      {/* ── Results ── */}
      {loading ? (
        <div className={`grid gap-4 ${view === 'list' ? 'grid-cols-1' : 'sm:grid-cols-2 xl:grid-cols-3'}`}>
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center">
            <Search size={32} className="text-slate-300" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-700">No internships found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or search terms</p>
          </div>
          <button
            onClick={clearAll}
            className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className={`grid gap-4 ${view === 'list' ? 'grid-cols-1' : 'sm:grid-cols-2 xl:grid-cols-3'}`}>
          {items.map(internship => (
            <InternshipCard
              key={internship._id}
              internship={internship}
              onView={setSelected}
              view={view}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && pagination.pages > 1 && (
        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          limit={pagination.limit}
          onPage={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        />
      )}

      {/* ── Detail Modal ── */}
      {selected && (
        <InternshipModal internship={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
