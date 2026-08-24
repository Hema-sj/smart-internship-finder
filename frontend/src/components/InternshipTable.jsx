import { Sparkles } from 'lucide-react';
import CompensationDisplay from './CompensationDisplay';

function formatStartDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function matchClass(score) {
  if (score >= 85) return 'text-emerald-700 bg-emerald-50';
  if (score >= 70) return 'text-amber-700 bg-amber-50';
  return 'text-slate-600 bg-slate-100';
}

function companyName(internship) {
  return internship.companyId?.name || internship.company?.name || internship.company || '—';
}

export default function InternshipTable({ internships, onViewDetails, title, loading, emptyMessage }) {
  return (
    <section>
      {title && (
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <span className="text-sm text-slate-500">{internships.length} results</span>
        </div>
      )}

      <div className={`${title ? 'mt-5' : ''} overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm`}>
        <table className="min-w-[920px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Starting Date</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Course / Role</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Compensation</th>
              <th className="px-4 py-3">Certificate</th>
              <th className="px-4 py-3">AI Match</th>
              <th className="px-4 py-3 text-right">View Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  {Array.from({ length: 8 }).map((__, cell) => (
                    <td key={cell} className="px-4 py-4">
                      <div className="h-4 w-20 rounded bg-slate-100" />
                    </td>
                  ))}
                </tr>
              ))
            ) : internships.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center text-slate-500">
                  {emptyMessage || 'No internships match these filters.'}
                </td>
              </tr>
            ) : internships.map((internship) => (
              <tr key={internship._id || internship.id} className="hover:bg-emerald-50/40">
                <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-700">
                  {formatStartDate(internship.startDate)}
                </td>
                <td className="px-4 py-4 font-semibold text-slate-900">
                  {companyName(internship)}
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-900">{internship.course || '—'}</p>
                  <p className="text-xs text-slate-500">{internship.title}</p>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-slate-700">{internship.location || '—'}</td>
                <td className="px-4 py-4">
                  <CompensationDisplay internship={internship} />
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-slate-700">
                  {internship.certificateType || internship.certificate || '—'}
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${matchClass(internship.aiMatch || 0)}`}>
                    <Sparkles size={11} />
                    {internship.aiMatch ?? 0}%
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onViewDetails?.(internship)}
                    className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-800"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
