import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, ExternalLink } from 'lucide-react';
import InternshipSearch from './InternshipSearch';
import InternshipTable from './InternshipTable';
import InternshipDetailModal from './InternshipDetailModal';
import CompanyLinksModal from './CompanyLinksModal';
import LocationFilter from './LocationFilter';
import CompensationStatsCards from './CompensationStatsCards';
import {
  fetchInternships,
  fetchInternshipById,
  fetchInternshipStats,
} from '../services/internshipService';
import { CANONICAL_LOCATIONS, LOCATION_CAREER_LINKS } from '../data/locations';

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
  
  // New filter states
  const [compensationRange, setCompensationRange] = useState(syncUrl ? (searchParams.get('compRange') || '') : '');
  const [certificate, setCertificate] = useState(syncUrl ? (searchParams.get('cert') || '') : '');
  const [mode, setMode] = useState(syncUrl ? (searchParams.get('mode') || '') : '');
  const [duration, setDuration] = useState(syncUrl ? (searchParams.get('duration') || '') : '');

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: pageSize });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [companyLinksLocation, setCompanyLinksLocation] = useState(null);
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
    if (compensationRange) next.compRange = compensationRange;
    if (certificate) next.cert = certificate;
    if (mode) next.mode = mode;
    if (duration) next.duration = duration;
    if (page > 1) next.page = String(page);
    setSearchParams(next, { replace: true });
  }, [keyword, location, course, startDate, sort, compensationType, compensationRange, certificate, mode, duration, page, setSearchParams, syncUrl]);

  useEffect(() => {
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
      const response = await fetchInternships({
        page,
        limit: pageSize,
        sort,
        compensationType,
        location,
        course,
        startDate,
        keyword,
        compensationRange,
        certificate,
        mode,
        duration,
      });
      // Backend returns: { data: [], totalCount, totalPages, currentPage }
      setItems(response.data || []);
      setPagination({ 
        page: response.currentPage || page, 
        pages: response.totalPages || 1, 
        total: response.totalCount || 0, 
        limit: pageSize 
      });
    } catch {
      setItems([]);
      setPagination({ page: 1, pages: 1, total: 0, limit: pageSize });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sort, compensationType, location, course, startDate, keyword, compensationRange, certificate, mode, duration]);

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
  const companyLinks = (location && LOCATION_CAREER_LINKS[location]) ? LOCATION_CAREER_LINKS[location] : [];

  return (
    <div className="space-y-5">
      <div>
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-600">
          {location ? <><MapPin size={12} /> {location}</> : 'Browse'}
        </p>
        <h1 className="mt-0.5 text-3xl font-extrabold text-slate-900">{heading}</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Select a location to see official company career links
        </p>
      </div>

      <CompensationStatsCards
        total={stats.total}
        paid={stats.paid}
        unpaid={stats.unpaid}
        loading={statsLoading}
      />

      <LocationFilter
        value={location}
        onChange={resetPage(setLocation)}
        locations={CANONICAL_LOCATIONS}
        enableNavigation={false}
      />

      {/* Show company career links when location is selected */}
      {location && companyLinks.length > 0 && (
        <div className="rounded-xl border-2 border-emerald-100 bg-emerald-50 p-6">
          <h3 className="text-sm font-bold text-emerald-900 mb-3 flex items-center gap-2">
            <MapPin size={16} />
            Official Company Career Pages in {location}
          </h3>
          <p className="text-xs text-emerald-700 mb-4">
            Apply directly on these official company career websites ↓
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {companyLinks.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-lg border-2 border-white bg-white hover:border-emerald-500 hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600">
                    {item.company}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Careers Portal</p>
                </div>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-emerald-600 ml-2 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Show helpful message when no location is selected */}
      {!location && (
        <div className="rounded-xl border-2 border-blue-100 bg-blue-50 p-6 text-center">
          <h3 className="text-sm font-bold text-blue-900 mb-2">
            💡 Want to see company career links?
          </h3>
          <p className="text-xs text-blue-700">
            Select a city from the <strong>"Preferred location"</strong> dropdown above to see official company career pages for that location!
          </p>
        </div>
      )}

      {/* Removed search filters to show only company career links */}

      <InternshipTable
        internships={items}
        onViewDetails={handleViewDetails}
        onLocationClick={(loc) => {
          console.log('Location clicked:', loc);
          setCompanyLinksLocation(loc);
        }}
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

      {companyLinksLocation && (
        <CompanyLinksModal location={companyLinksLocation} onClose={() => setCompanyLinksLocation(null)} />
      )}
    </div>
  );
}
