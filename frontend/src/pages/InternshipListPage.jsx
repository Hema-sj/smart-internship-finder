import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search, SlidersHorizontal, MapPin, BookOpen, Calendar,
  ChevronLeft, ChevronRight, Loader2, AlertCircle, X, ArrowUpDown
} from 'lucide-react';
import InternshipCard from '../components/InternshipCard';
import InternshipDetailModal from '../components/InternshipDetailModal';
import { fetchInternships } from '../services/internshipService';
import { internships as staticData } from '../data/internships';

// ─── Constants ──────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: 'bestMatch', label: 'Best Match' },
  { value: 'newest', label: 'Newest' },
  { value: 'startingSoon', label: 'Starting Soon' },
  { value: 'highestStipend', label: 'Highest Stipend' },
];

const COMP_TABS = [
  { value: 'All', label: 'All' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Unpaid', label: 'Unpaid' },
];

const LOCATIONS = ['Chennai', 'Bangalore', 'Coimbatore', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi', 'Kochi', 'Remote'];

const COURSES = [
  'Software Engineering', 'Data Science', 'Frontend Development', 'Backend Development',
  'Machine Learning', 'Cloud Engineering', 'Product Design', 'AI Research',
  'DevOps', 'Mobile Development', 'Business Analytics', 'Cybersecurity',
];

const PAGE_SIZE = 12;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Filter & sort static data client-side (fallback when API is unavailable). */
function applyLocalFilters(data, { compensationType, location, course, startDate, keyword, sort }) {
  let result = [...data];
  if (compensationType && compensationType !== 'All') result = result.filter(i => i.type === compensationType || i.compensationType === compensationType);
  if (location) result = result.filter(i => i.location?.toLowerCase() === location.toLowerCase());
  if (course) result = result.filter(i => i.course?.toLowerCase().includes(course.toLowerCase()));
  if (keyword) {
    const kw = keyword.toLowerCase();
    result = result.filter(i =>
      [i.title, i.company, i.course, ...(i.skills || [])].some(v => v?.toLowerCase().includes(kw))
    );
  }
  if (sort === 'highestStipend') result.sort((a, b) => (Number(b.stipend) || 0) - (Number(a.stipend) || 0));
  else if (sort === 'startingSoon') result.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  else if (sort === 'newest') result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  else result.sort((a, b) => (b.aiMatch || 0) - (a.aiMatch || 0)); // bestMatch
  return result;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterSelect({ icon: Icon, label, value, onChange, options, placeholder }) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition">
      <Icon size={15} className="shrink-0 text-slate-400" />
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm text-slate-700 outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function ActiveFilterPill({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
      {label}
      <button onClick={onRemove} className="ml-0.5 rounded-full hover:bg-emerald-100 p-0.5" aria-label={`Remove ${label} filter`}>
        <X size={10} />
      </button>
    </span>
  );
}

function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null;
  const range = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(pages, page + 2); i++) range.push(i);
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5">
      <button
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      {range[0] > 1 && <span className="px-1 text-slate-400">…</span>}
      {range.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          aria-current={p === page ? 'page' : undefined}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition ${
            p === page
              ? 'border-emerald-600 bg-emerald-700 text-white shadow-sm'
              : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700'
          }`}
        >
          {p}
        </button>
      ))}
      {range[range.length - 1] < pages && <span className="px-1 text-slate-400">…</span>}
      <button
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InternshipListPage() {
  const [searchParams] = useSearchParams();

  // Filters — seed location from URL query param (?location=Chennai)
  const [compensationType, setCompensationType] = useState('All');
  const [location, setLocation] = useState(() => searchParams.get('location') || '');
  const [course, setCourse] = useState('');
  const [startDate, setStartDate] = useState('');
  const [keyword, setKeyword] = useState('');
  const [inputValue, setInputValue] = useState(''); // debounce buffer
  const [sort, setSort] = useState('bestMatch');
  const [page, setPage] = useState(1);

  // Data
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingStatic, setUsingStatic] = useState(false);

  // Modal
  const [selectedInternship, setSelectedInternship] = useState(null);

  // Sidebar toggle (mobile)
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Debounce keyword
  const debounceRef = useRef(null);
  const handleKeywordChange = (val) => {
    setInputValue(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setKeyword(val); setPage(1); }, 400);
  };

  // Fetch data
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInternships({ page, limit: PAGE_SIZE, sort, compensationType, location, course, startDate, keyword });
      setItems(data.items);
      setPagination(data.pagination);
      setUsingStatic(false);
    } catch {
      // API unavailable — fall back to static data
      const filtered = applyLocalFilters(staticData, { compensationType, location, course, startDate, keyword, sort });
      const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
      const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
      setItems(paged);
      setPagination({ page, pages: totalPages, total: filtered.length });
      setUsingStatic(true);
    }
    setLoading(false);
  }, [page, sort, compensationType, location, course, startDate, keyword]);

  useEffect(() => { load(); }, [load]);

  // Reset to page 1 when filters change
  const setFilter = (setter) => (val) => { setter(val); setPage(1); };

  // Active filters
  const activeFilters = [
    location && { label: `📍 ${location}`, remove: () => setFilter(setLocation)('') },
    course && { label: `📚 ${course}`, remove: () => setFilter(setCourse)('') },
    startDate && { label: `📅 After ${new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`, remove: () => setFilter(setStartDate)('') },
  ].filter(Boolean);

  const clearAll = () => { setLocation(''); setCourse(''); setStartDate(''); setKeyword(''); setInputValue(''); setCompensationType('All'); setSort('bestMatch'); setPage(1); };

  const hasFilters = location || course || startDate || keyword || compensationType !== 'All';

  // Dynamic title
  const pageTitle = location ? `Internships in ${location}` : 'Internship Listings';
  const pageLabel = location ? location : 'Browse';

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">{pageLabel}</p>
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900">{pageTitle}</h1>
          {!loading && (
            <p className="mt-1 text-sm text-slate-500">
              {pagination.total} opportunities found
              {usingStatic && <span className="ml-1 text-xs text-amber-600">(offline preview)</span>}
            </p>
          )}
        </div>
      </div>

      {/* Compensation tabs & Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1 w-fit shadow-sm">
          {COMP_TABS.map((tab) => (
            <button
              key={tab.value}
              id={`comp-tab-${tab.value.toLowerCase()}`}
              onClick={() => setFilter(setCompensationType)(tab.value)}
              className={`rounded-lg px-6 py-2.5 text-sm font-bold transition ${
                compensationType === tab.value
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown size={14} className="text-slate-400" />
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            aria-label="Sort internships"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex gap-2">
        <label
          htmlFor="internship-search"
          className="flex flex-1 items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition"
        >
          <Search size={16} className="shrink-0 text-slate-400" />
          <input
            id="internship-search"
            type="search"
            placeholder="Search role, company, skill, or keyword…"
            value={inputValue}
            onChange={(e) => handleKeywordChange(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
          />
          {inputValue && (
            <button onClick={() => handleKeywordChange('')} className="shrink-0 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </label>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 md:hidden"
          aria-expanded={filtersOpen}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal size={16} />
          Filters {hasFilters && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">{activeFilters.length + (compensationType !== 'All' ? 1 : 0)}</span>}
        </button>
      </div>

      {/* Advanced filters (desktop always visible, mobile toggleable) */}
      <div className={`grid gap-3 sm:grid-cols-3 ${filtersOpen ? 'block' : 'hidden md:grid'}`}>
        <FilterSelect
          icon={MapPin}
          label="Location"
          value={location}
          onChange={setFilter(setLocation)}
          options={LOCATIONS}
          placeholder="All locations"
        />
        <FilterSelect
          icon={BookOpen}
          label="Course"
          value={course}
          onChange={setFilter(setCourse)}
          options={COURSES}
          placeholder="All courses"
        />
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition">
          <Calendar size={15} className="shrink-0 text-slate-400" />
          <input
            type="date"
            aria-label="Starting date filter"
            value={startDate}
            onChange={(e) => setFilter(setStartDate)(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-700 outline-none"
          />
        </label>
      </div>

      {/* Active filter pills */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((f) => (
            <ActiveFilterPill key={f.label} label={f.label} onRemove={f.remove} />
          ))}
          <button onClick={clearAll} className="text-xs text-slate-500 underline hover:text-slate-700">
            Clear all
          </button>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
          <Loader2 size={28} className="animate-spin text-emerald-600" />
          <p className="text-sm">Loading internships…</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-600">
          <AlertCircle size={28} />
          <p className="text-sm font-semibold">{error}</p>
          <button onClick={load} className="rounded-lg border border-red-200 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-50">
            Retry
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
          <Search size={28} className="text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">No internships match your filters</p>
          <button onClick={clearAll} className="rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((internship) => (
            <InternshipCard
              key={internship._id || internship.id}
              internship={internship}
              onViewDetails={setSelectedInternship}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <div className="flex flex-col items-center gap-2 pt-2">
          <Pagination page={pagination.page} pages={pagination.pages} onPage={setPage} />
          <p className="text-xs text-slate-400">
            Page {pagination.page} of {pagination.pages} · {pagination.total} total
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedInternship && (
        <InternshipDetailModal
          internship={selectedInternship}
          onClose={() => setSelectedInternship(null)}
        />
      )}
    </div>
  );
}
