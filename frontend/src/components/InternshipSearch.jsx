import { Search, BookOpen, Calendar, ArrowUpDown, DollarSign, Award, Laptop, Clock, X } from 'lucide-react';
import { INTERNSHIP_COURSES } from '../data/courses';

const COMP_FILTERS = [
  { value: 'All', label: 'All' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Unpaid', label: 'Unpaid' },
];

const COMPENSATION_OPTIONS = [
  { value: '', label: 'All Compensation' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Unpaid', label: 'Unpaid' },
  { value: '0-5000', label: '₹0 - ₹5,000' },
  { value: '5000-10000', label: '₹5,000 - ₹10,000' },
  { value: '10000-20000', label: '₹10,000 - ₹20,000' },
  { value: '20000+', label: '₹20,000+' },
];

const CERTIFICATE_OPTIONS = [
  { value: '', label: 'All Certificates' },
  { value: 'Hard Copy', label: 'Hard Copy' },
  { value: 'Soft Copy', label: 'Soft Copy' },
  { value: 'Both', label: 'Both Hard and Soft Copy' },
  { value: 'No Certificate', label: 'Not Provided' },
];

const MODE_OPTIONS = [
  { value: '', label: 'All Modes' },
  { value: 'Remote', label: 'Online' },
  { value: 'On-site', label: 'Offline' },
  { value: 'Hybrid', label: 'Hybrid' },
];

const DURATION_OPTIONS = [
  { value: '', label: 'All Durations' },
  { value: '1 Month', label: '1 Month' },
  { value: '2 Months', label: '2 Months' },
  { value: '3 Months', label: '3 Months' },
  { value: '4 Months', label: '4 Months' },
  { value: '6 Months', label: '6 Months' },
];

const SORT_OPTIONS = [
  { value: 'bestMatch', label: 'Best Match' },
  { value: 'newest', label: 'Newest' },
  { value: 'startingSoon', label: 'Starting Soon' },
  { value: 'highestStipend', label: 'Highest Stipend' },
  { value: 'deadline', label: 'Application Deadline' },
  { value: 'highestAIMatch', label: 'Highest AI Match' },
  { value: 'highestRating', label: 'Highest Company Rating' },
];

const LOCATION_OPTIONS = [
  'Chennai',
  'Bangalore',
  'Coimbatore',
  'Hyderabad',
  'Pune',
  'Mumbai',
  'Delhi',
  'Kochi',
  'Remote'
];

export default function InternshipSearch({
  keyword, onKeywordChange,
  compensationType, onCompensationChange,
  course, onCourseChange,
  startDate, onStartDateChange,
  sort, onSortChange,
  onSubmit,
  // New filter props
  location = '', onLocationChange,
  compensationRange = '', onCompensationRangeChange,
  certificate = '', onCertificateChange,
  mode = '', onModeChange,
  duration = '', onDurationChange,
  onClearFilters,
}) {
  const handleClearFilters = () => {
    onKeywordChange?.('');
    onCourseChange?.('');
    onStartDateChange?.('');
    onLocationChange?.('');
    onCompensationRangeChange?.('');
    onCertificateChange?.('');
    onModeChange?.('');
    onDurationChange?.('');
    onSortChange?.('bestMatch');
    onCompensationChange?.('All');
    onClearFilters?.();
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-xl font-bold text-slate-900">Search & Filter Internships</h2>

      {/* Paid/Unpaid Tabs */}
      <div className="mt-4 flex w-full gap-1.5 overflow-x-auto rounded-xl bg-slate-100 p-1 sm:w-fit sm:flex-wrap">
        {COMP_FILTERS.map((option) => {
          const active = compensationType === option.value;
          const activeClass = option.value === 'Paid'
            ? 'bg-emerald-600 text-white shadow-sm'
            : option.value === 'Unpaid'
            ? 'bg-orange-600 text-white shadow-sm'
            : 'bg-slate-800 text-white shadow-sm';
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onCompensationChange(option.value)}
              className={`shrink-0 rounded-lg px-3 py-2 text-sm font-bold transition sm:px-4 ${
                active ? activeClass : 'text-slate-600 hover:bg-white'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Filter Grid - All 9 Filters in Separate Inputs */}
      <form
        className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit?.();
        }}
      >
        {/* Filter 1: Search role, company, or keyword */}
        <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 sm:col-span-2 lg:col-span-3 xl:col-span-2">
          <Search size={16} className="shrink-0 text-slate-400" />
          <input
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            className="w-full py-3 text-sm outline-none"
            placeholder="Search role, company, or keyword"
            aria-label="Search keyword"
          />
        </label>

        {/* Filter 2: Course */}
        <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3">
          <BookOpen size={15} className="shrink-0 text-slate-400" />
          <select
            value={course}
            onChange={(event) => onCourseChange(event.target.value)}
            className="w-full bg-transparent py-3 text-sm outline-none"
            aria-label="Course"
          >
            <option value="">All Courses</option>
            <option value="Software Development">Software Development</option>
            <option value="Web Development">Web Development</option>
            <option value="Full Stack Development">Full Stack Development</option>
            <option value="Python Development">Python Development</option>
            <option value="Java Development">Java Development</option>
            <option value="Data Analytics">Data Analytics</option>
            <option value="Data Science">Data Science</option>
            <option value="AI / Machine Learning">AI / Machine Learning</option>
            <option value="Cloud Computing">Cloud Computing</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="UI / UX Design">UI / UX Design</option>
            <option value="DevOps">DevOps</option>
          </select>
        </label>

        {/* Filter 3: Starting Date */}
        <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3">
          <Calendar size={15} className="shrink-0 text-slate-400" />
          <input
            type="date"
            value={startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
            className="w-full bg-transparent py-3 text-sm outline-none"
            aria-label="Starting date"
          />
        </label>

        {/* Filter 4: Location */}
        <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3">
          <Search size={15} className="shrink-0 text-slate-400" />
          <select
            value={location}
            onChange={(event) => onLocationChange?.(event.target.value)}
            className="w-full bg-transparent py-3 text-sm outline-none"
            aria-label="Location"
          >
            <option value="">All Locations</option>
            {LOCATION_OPTIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </label>

        {/* Filter 5: Compensation */}
        <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3">
          <DollarSign size={15} className="shrink-0 text-slate-400" />
          <select
            value={compensationRange}
            onChange={(event) => onCompensationRangeChange?.(event.target.value)}
            className="w-full bg-transparent py-3 text-sm outline-none"
            aria-label="Compensation Range"
          >
            {COMPENSATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        {/* Filter 6: Certificate Type */}
        <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3">
          <Award size={15} className="shrink-0 text-slate-400" />
          <select
            value={certificate}
            onChange={(event) => onCertificateChange?.(event.target.value)}
            className="w-full bg-transparent py-3 text-sm outline-none"
            aria-label="Certificate Type"
          >
            {CERTIFICATE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        {/* Filter 7: Internship Mode */}
        <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3">
          <Laptop size={15} className="shrink-0 text-slate-400" />
          <select
            value={mode}
            onChange={(event) => onModeChange?.(event.target.value)}
            className="w-full bg-transparent py-3 text-sm outline-none"
            aria-label="Internship Mode"
          >
            {MODE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        {/* Filter 8: Duration */}
        <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3">
          <Clock size={15} className="shrink-0 text-slate-400" />
          <select
            value={duration}
            onChange={(event) => onDurationChange?.(event.target.value)}
            className="w-full bg-transparent py-3 text-sm outline-none"
            aria-label="Duration"
          >
            {DURATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        {/* Filter 9: Sort By */}
        <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3">
          <ArrowUpDown size={15} className="shrink-0 text-slate-400" />
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            className="w-full bg-transparent py-3 text-sm outline-none"
            aria-label="Sort internships"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        {/* Action Buttons */}
        <button 
          type="button"
          onClick={handleClearFilters}
          className="flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
        >
          <X size={16} />
          Clear Filters
        </button>

        <button 
          type="submit" 
          className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 transition"
        >
          Search
        </button>
      </form>
    </section>
  );
}
