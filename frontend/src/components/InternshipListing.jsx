import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import InternshipSearch from './InternshipSearch';
import InternshipTable from './InternshipTable';
import InternshipDetailModal from './InternshipDetailModal';
import LocationFilter from './LocationFilter';
import CompensationStatsCards from './CompensationStatsCards';
import {
  fetchInternships,
  fetchInternshipById,
  fetchCourses,
  fetchInternshipStats,
} from '../services/internshipService';
import { CANONICAL_LOCATIONS } from '../data/locations';

function Pagination({ page, pages, total, limit, onPage }) {
  if (pages <= 1) return null;
  const range = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(pages, page + 2); i += 1) range.push(i);
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center gap-3 pt-2">
      <nav aria-label="Pagination" className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {range[0] > 1 && <span className="px-1 text-sm text-slate-400">…</span>}
        {range.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onPage(item)}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-bold ${
              item === page
                ? 'border-emerald-700 bg-emerald-700 text-white'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            {item}
          </button>
        ))}
        {range[range.length - 1] < pages && <span className="px-1 text-sm text-slate-400">…</span>}
        <button
          type="button"
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </nav>
      <p className="text-xs text-slate-400">Showing {from}–{to} of {total} internships</p>
    </div>
  );
}

function emptyStateMessage({ location, course, compensationType, keyword, startDate }) {
  if (location) {
    return `No internships found in ${location} matching your selected filters.`;
  }
  if (course || keyword || startDate || (compensationType && compensationType !== 'All')) {
    return 'No internships found matching your selected filters.';
  }
  return 'No internships found.';
}

export default function InternshipListing({ compact = false, pageSize = 10, title, syncUrl = true }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [compensationType, setCompensationType] = useState(syncUrl ? (searchParams.get('comp') || 'All') : 'All');
  const [location, setLocation] = useState(syncUrl ? (searchParams.get('location') || '') : '');
  const [course, setCourse] = useState(syncUrl ? (searchParams.get('course') || '') : '');
  const [startDate, setStartDate] = useState(syncUrl ? (searchParams.get('date') || '') : '');
  const [keyword, setKeyword] = useState(syncUrl ? (searchParams.get('q') || '') : '');
  const [inputVal, setInputVal] = useState(syncUrl ? (searchParams.get('q') || '') : '');
  const [sort, setSort] = useState(syncUrl ? (searchParams.get('sort') || 'bestMatch') : 'bestMatch');
  const [page, setPage] = useState(syncUrl ? (Number(searchParams.get('page')) || 1) : 1);

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: pageSize });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ total: 0, paid: 0, unpaid: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!syncUrl) return;
    const urlLocation = searchParams.get('location') || '';
    if (urlLocation !== location) {
      setLocation(urlLocation);
      setPage(1);
    }
  }, [searchParams, syncUrl, location]);

  useEffect(() => {
    if (!syncUrl) return;
    const next = {};
    if (keyword) next.q = keyword;
    if (location) next.location = location;
    if (course) next.course = course;
    if (startDate) next.date = startDate;
    if (sort !== 'bestMatch') next.sort = sort;
    if (compensationType !== 'All') next.comp = compensationType;
    if (page > 1) next.page = String(page);
    setSearchParams(next, { replace: true });
  }, [keyword, location, course, startDate, sort, compensationType, page, setSearchParams, syncUrl]);

  useEffect(() => {
    fetchCourses()
      .then((list) => { if (Array.isArray(list) && list.length) setCourses(list); })
      .catch(() => {});
    fetchInternshipStats()
      .then((data) => setStats({
        total: data.total ?? 0,
        paid: data.paid ?? 0,
        unpaid: data.unpaid ?? 0,
      }))
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchInternships({
        page,
        limit: pageSize,
        sort,
        compensationType,
        location,
        course,
        startDate,
        keyword,
      });
      setItems(data.items || []);
      setPagination(data.pagination || { page, pages: 1, total: 0, limit: pageSize });
    } catch {
      setItems([]);
      setPagination({ page: 1, pages: 1, total: 0, limit: pageSize });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sort, compensationType, location, course, startDate, keyword]);

  useEffect(() => { load(); }, [load]);

  const resetPage = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleKeywordChange = (value) => {
    setInputVal(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setKeyword(value);
      setPage(1);
    }, 400);
  };

  const handleViewDetails = async (internship) => {
    setSelected(internship);
    if (!internship?._id) return;
    try {
      const full = await fetchInternshipById(internship._id);
      setSelected(full);
    } catch {
      setSelected(internship);
    }
  };

  const heading = location ? `Internships in ${location}` : 'Internship Listings';

  return (
    <div className="space-y-5">
      {!compact && (
        <div>
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-600">
            {location ? <><MapPin size={12} /> {location}</> : 'Browse'}
          </p>
          <h1 className="mt-0.5 text-3xl font-extrabold text-slate-900">{heading}</h1>
          {!loading && (
            <p className="mt-0.5 text-sm text-slate-500">
              {pagination.total.toLocaleString()} internship{pagination.total !== 1 ? 's' : ''} found
              {location ? ` in ${location}` : ''}
            </p>
          )}
        </div>
      )}

      {!compact && (
        <CompensationStatsCards
          total={stats.total}
          paid={stats.paid}
          unpaid={stats.unpaid}
          loading={statsLoading}
        />
      )}

      <LocationFilter
        value={location}
        onChange={resetPage(setLocation)}
        locations={CANONICAL_LOCATIONS}
      />

      <InternshipSearch
        keyword={inputVal}
        onKeywordChange={handleKeywordChange}
        compensationType={compensationType}
        onCompensationChange={resetPage(setCompensationType)}
        course={course}
        onCourseChange={resetPage(setCourse)}
        courses={courses}
        startDate={startDate}
        onStartDateChange={resetPage(setStartDate)}
        sort={sort}
        onSortChange={resetPage(setSort)}
        onSubmit={load}
      />

      <InternshipTable
        internships={items}
        onViewDetails={handleViewDetails}
        title={compact ? title : undefined}
        loading={loading}
        emptyMessage={emptyStateMessage({ location, course, compensationType, keyword, startDate })}
      />

      <Pagination
        page={pagination.page}
        pages={pagination.pages}
        total={pagination.total}
        limit={pagination.limit}
        onPage={(next) => {
          setPage(next);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {selected && (
        <InternshipDetailModal internship={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
