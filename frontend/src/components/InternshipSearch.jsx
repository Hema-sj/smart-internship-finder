import { Search, BookOpen, Calendar, ArrowUpDown } from 'lucide-react';

const COMP_FILTERS = [
  { value: 'All', label: 'All Internships' },
  { value: 'Paid', label: 'Paid Internships' },
  { value: 'Unpaid', label: 'Unpaid Internships' },
];

const SORT_OPTIONS = [
  { value: 'bestMatch', label: 'Best Match' },
  { value: 'newest', label: 'Newest' },
  { value: 'startingSoon', label: 'Starting Soon' },
  { value: 'highestStipend', label: 'Highest Stipend' },
];

export default function InternshipSearch({
  keyword, onKeywordChange,
  compensationType, onCompensationChange,
  course, onCourseChange, courses = [],
  startDate, onStartDateChange,
  sort, onSortChange,
  onSubmit,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-xl font-bold text-slate-900">Search Internships</h2>

      <div className="mt-4 flex w-full gap-1.5 overflow-x-auto rounded-xl bg-slate-100 p-1 sm:w-fit sm:flex-wrap">
        {COMP_FILTERS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onCompensationChange(option.value)}
            className={`shrink-0 rounded-lg px-3 py-2 text-sm font-bold transition sm:px-4 ${
              compensationType === option.value
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <form
        className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_180px_170px_180px_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit?.();
        }}
      >
        <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 sm:col-span-2 xl:col-span-1">
          <Search size={16} className="shrink-0 text-slate-400" />
          <input
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            className="w-full py-3 text-sm outline-none"
            placeholder="Search role, company, or keyword"
            aria-label="Search keyword"
          />
        </label>

        <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3">
          <BookOpen size={15} className="shrink-0 text-slate-400" />
          <select
            value={course}
            onChange={(event) => onCourseChange(event.target.value)}
            className="w-full bg-transparent py-3 text-sm outline-none"
            aria-label="Course"
          >
            <option value="">Course</option>
            {courses.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

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

        <button type="submit" className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">
          Search
        </button>
      </form>
    </section>
  );
}
