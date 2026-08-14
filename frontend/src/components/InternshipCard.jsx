import { MapPin, Calendar, IndianRupee, Sparkles, Award, BookOpen } from 'lucide-react';

export default function InternshipCard({ internship, onViewDetails }) {
  const company = internship.companyId || {};
  const isPaid = internship.compensationType === 'Paid';
  const stipend = isPaid
    ? `₹${Number(internship.stipend).toLocaleString('en-IN')}/mo`
    : internship.compensationType;

  const startDate = internship.startDate
    ? new Date(internship.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

  // fallback for static data shape
  const companyName = company.name || internship.company || 'Company';
  const skillList = internship.requiredSkills?.length
    ? internship.requiredSkills.map((s) => s.name || s)
    : (internship.skills || []);

  return (
    <article className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">

      {/* Top row: company avatar + name + badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 text-sm font-bold text-white shadow-sm">
            {companyName[0]}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">{internship.title}</p>
            <p className="text-xs text-slate-500">{companyName}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {internship.compensationType}
        </span>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><MapPin size={11} className="text-slate-400 shrink-0" />{internship.location}</span>
        <span className="flex items-center gap-1.5"><IndianRupee size={11} className="text-slate-400 shrink-0" />{stipend}</span>
        <span className="flex items-center gap-1.5 col-span-2"><Calendar size={11} className="text-slate-400 shrink-0" />Starts {startDate}</span>
        <span className="flex items-center gap-1.5"><BookOpen size={11} className="text-slate-400 shrink-0" />{internship.course}</span>
        <span className="flex items-center gap-1.5"><Award size={11} className="text-slate-400 shrink-0" />{internship.certificateType || internship.certificate || '—'}</span>
      </div>

      {/* Skills */}
      {skillList.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {skillList.slice(0, 4).map((s) => (
            <span key={s} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{s}</span>
          ))}
          {skillList.length > 4 && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-400">+{skillList.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
          <Sparkles size={11} />{internship.aiMatch}% AI Match
        </span>
        <button
          onClick={() => onViewDetails(internship)}
          className="rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-800 active:scale-95"
        >
          View Details
        </button>
      </div>
    </article>
  );
}
