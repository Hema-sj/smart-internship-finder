import { ExternalLink, AlertCircle, CheckCircle, Eye } from 'lucide-react';
import { useState } from 'react';

/**
 * InternshipTable - Displays internships in tabular format with 9 columns
 * Columns: Starting Date, Company, Internship Role, Location, Duration, 
 *          Required Skills, Compensation, Paid/Unpaid, Official Link
 * Optional: Application Deadline column (when showDeadline is true)
 */
export default function InternshipTable({ internships, loading, onViewDetails, emptyMessage, showDeadline = false }) {
  const [expandedSkills, setExpandedSkills] = useState({});

  const toggleSkills = (id) => {
    setExpandedSkills(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Loading internships...</div>
      </div>
    );
  }

  if (!internships || internships.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <AlertCircle className="mx-auto mb-3 text-slate-400" size={32} />
        <p className="font-semibold text-slate-700">{emptyMessage || 'No internships found'}</p>
        <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-max">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
              Starting Date
            </th>
            {showDeadline && (
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                Application Deadline
              </th>
            )}
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
              Company
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
              Internship Role
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
              Location
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
              Duration
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
              Required Skills
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
              Compensation
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
              Paid / Unpaid
            </th>
            <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
              Official Link
            </th>
            <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {internships.map((internship) => {
            const isExpanded = expandedSkills[internship._id];
            const hasMoreSkills = internship.displaySkillsRemaining > 0;
            
            return (
              <tr 
                key={internship._id} 
                className="hover:bg-slate-50 transition-colors"
              >
                {/* Starting Date */}
                <td className="px-4 py-4 text-sm text-slate-700 whitespace-nowrap">
                  {internship.displayStartingDate}
                </td>

                {/* Application Deadline (optional) */}
                {showDeadline && (
                  <td className="px-4 py-4 text-sm text-slate-700 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span>{internship.displayDeadline}</span>
                      {internship.applicationDeadline && (
                        <span className="text-xs text-slate-500 mt-0.5">
                          {(() => {
                            const now = new Date();
                            const deadline = new Date(internship.applicationDeadline);
                            const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
                            if (daysLeft < 0) return 'Expired';
                            if (daysLeft === 0) return 'Today';
                            if (daysLeft === 1) return '1 day left';
                            if (daysLeft <= 7) return `${daysLeft} days left`;
                            return null;
                          })()}
                        </span>
                      )}
                    </div>
                  </td>
                )}

                {/* Company */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {internship.displayCompanyLogo && (
                      <img 
                        src={internship.displayCompanyLogo} 
                        alt={internship.displayCompany}
                        className="h-8 w-8 rounded object-contain"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800 text-sm">
                          {internship.displayCompany}
                        </span>
                        {internship.displayCompanyVerified && (
                          <CheckCircle size={12} className="text-emerald-600" />
                        )}
                      </div>
                      {internship.isDemoData && (
                        <span className="text-xs text-amber-600 font-medium">Demo Data</span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Internship Role */}
                <td className="px-4 py-4">
                  <div className="text-sm font-semibold text-slate-800 max-w-xs">
                    {internship.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {internship.courseRole}
                  </div>
                </td>

                {/* Location */}
                <td className="px-4 py-4 text-sm text-slate-700 whitespace-nowrap">
                  <div>{internship.location}</div>
                  {internship.mode && (
                    <div className="text-xs text-slate-500 mt-0.5 capitalize">
                      {internship.mode}
                    </div>
                  )}
                </td>

                {/* Duration */}
                <td className="px-4 py-4 text-sm text-slate-700 whitespace-nowrap">
                  {internship.displayDuration}
                </td>

                {/* Required Skills */}
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {(isExpanded ? internship.requiredSkills : internship.displaySkills).map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-block rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700"
                      >
                        {skill}
                      </span>
                    ))}
                    {hasMoreSkills && !isExpanded && (
                      <button
                        onClick={() => toggleSkills(internship._id)}
                        className="inline-block rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
                      >
                        +{internship.displaySkillsRemaining} More
                      </button>
                    )}
                    {hasMoreSkills && isExpanded && (
                      <button
                        onClick={() => toggleSkills(internship._id)}
                        className="inline-block rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
                      >
                        Show Less
                      </button>
                    )}
                  </div>
                </td>

                {/* Compensation */}
                <td className="px-4 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                  {internship.displayCompensation}
                </td>

                {/* Paid / Unpaid */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                      internship.displayInternshipType === 'Paid'
                        ? 'bg-emerald-100 text-emerald-700'
                        : internship.displayInternshipType === 'Unpaid'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {internship.displayInternshipType}
                  </span>
                </td>

                {/* Official Link */}
                <td className="px-4 py-4 text-center">
                  {internship.displayOfficialLinkAvailable ? (
                    <a
                      href={internship.displayOfficialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition active:scale-95"
                    >
                      Apply Now
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 cursor-not-allowed"
                      title="Official application link not available"
                    >
                      Not Available
                    </button>
                  )}
                </td>

                {/* View Details */}
                <td className="px-4 py-4 text-center">
                  {onViewDetails && (
                    <button
                      onClick={() => onViewDetails(internship)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Eye size={12} />
                      View
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
