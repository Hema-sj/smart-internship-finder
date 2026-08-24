import { useEffect } from 'react';
import {
  X, MapPin, Calendar, IndianRupee, Award, Briefcase, Clock,
  ExternalLink, Sparkles, Star, Globe, CheckCircle, BookOpen
} from 'lucide-react';

import CompensationBadge from './CompensationBadge';
import { getCompensationSummary } from '../utils/compensation';

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
        <Icon size={15} className="text-emerald-600" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export default function InternshipDetailModal({ internship, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!internship) return null;

  const company = internship.companyId || {};
  const summary = getCompensationSummary(internship);
  const stipendDisplay = summary.subtitle
    ? `${summary.amount} ${summary.subtitle}`
    : summary.amount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4"
      style={{ backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl max-h-[92vh]">

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-6 text-white">
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute -right-2 top-12 h-16 w-16 rounded-full bg-white/10" />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          <div className="flex items-start gap-4 pr-10">
            {/* Company avatar */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/20 text-xl font-bold">
              {(company.name || 'C')[0]}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold leading-tight">{internship.title}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="font-medium text-emerald-100">{company.name || 'Company'}</span>
                {company.verified && (
                  <span className="flex items-center gap-0.5 text-xs text-emerald-200">
                    <CheckCircle size={11} /> Verified
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <CompensationBadge compensationType={internship.compensationType} />
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold capitalize">
                  {internship.mode}
                </span>
                {internship.aiMatch > 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold">
                    <Sparkles size={11} /> {internship.aiMatch}% match
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0 sm:divide-x">

            {/* Left — details */}
            <div className="p-6">
              <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">Internship Details</h3>
              <InfoRow icon={MapPin} label="Location" value={`${internship.location} ${internship.mode === 'remote' ? '(Remote)' : internship.mode === 'hybrid' ? '(Hybrid)' : ''}`} />
              <InfoRow icon={BookOpen} label="Course / Role" value={internship.course} />
              <InfoRow icon={Calendar} label="Starting Date" value={internship.startDate ? new Date(internship.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null} />
              <InfoRow icon={Clock} label="Duration" value={internship.duration} />
              <InfoRow icon={IndianRupee} label="Compensation" value={stipendDisplay} />
              <InfoRow icon={Award} label="Certificate" value={internship.certificateType} />
              {internship.applicationDeadline && (
                <InfoRow icon={Calendar} label="Apply Before" value={new Date(internship.applicationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
              )}
            </div>

            {/* Right — company & skills */}
            <div className="p-6">
              <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">Company</h3>
              <div className="mb-4 rounded-xl bg-slate-50 p-4">
                <p className="font-bold text-slate-800">{company.name}</p>
                {company.location && <p className="mt-0.5 text-xs text-slate-500 flex items-center gap-1"><MapPin size={10}/>{company.location}</p>}
                {company.rating > 0 && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-600">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    {company.rating.toFixed(1)} · {company.reviewCount} reviews
                  </p>
                )}
                {company.description && <p className="mt-2 text-xs text-slate-500 leading-relaxed">{company.description}</p>}
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline">
                    <Globe size={11} /> {company.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>

              {internship.requiredSkills?.length > 0 && (
                <>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Required Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {internship.requiredSkills.map((s) => (
                      <span key={s._id || s} className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {s.name || s}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          {internship.description && (
            <div className="border-t border-slate-100 px-6 py-5">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">About this Internship</h3>
              <p className="text-sm leading-relaxed text-slate-600">{internship.description}</p>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex items-center gap-3">
          <a
            href={internship.applicationUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 active:scale-[0.98]"
          >
            Apply Now <ExternalLink size={14} />
          </a>
          {internship.internshipDetailsUrl && internship.internshipDetailsUrl !== '#' && (
            <a
              href={internship.internshipDetailsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              <Briefcase size={14} /> Details
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
