import { MapPin, Calendar, IndianRupee, Sparkles } from 'lucide-react';

export default function InternshipCard({ internship }) {
  const { title, company, location, type, stipend, skills, startDate, aiMatch } = internship;
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500">{company}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${type === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
          {type}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        <span className="flex items-center gap-1"><MapPin size={12} />{location}</span>
        <span className="flex items-center gap-1"><IndianRupee size={12} />{stipend}</span>
        <span className="flex items-center gap-1"><Calendar size={12} />Starts {new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {skills.map(skill => (
          <span key={skill} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{skill}</span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
          <Sparkles size={12} />{aiMatch}% AI Match
        </span>
        <button className="rounded-lg bg-emerald-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors">
          Apply Now
        </button>
      </div>
    </article>
  );
}
