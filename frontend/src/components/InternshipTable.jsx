import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import CertificateBadge from './CertificateBadge';

/**
 * InternshipTable - Displays internships in tabular format with 15 columns
 * 
 * Columns: 
 * 1. Starting Date
 * 2. Application Deadline  
 * 3. Company
 * 4. Course / Role
 * 5. Location
 * 6. Duration
 * 7. Internship Mode
 * 8. Compensation
 * 9. Paid / Unpaid
 * 10. Certificate
 * 11. Required Skills
 * 12. AI Match
 * 13. Company Rating
 * 14. Application Status
 * 15. View Details
 */
export default function InternshipTable({ 
  internships = [], 
  loading = false, 
  onViewDetails, 
  emptyMessage = 'No internships found',
}) {
  const [expandedSkills, setExpandedSkills] = useState({});
  const navigate = useNavigate();

  const toggleSkills = (id) => {
    setExpandedSkills(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
        <p className="mt-3 text-sm text-slate-500">Loading internships...</p>
      </div>
    );
  }

  if (!internships || internships.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-12 w-12 text-slate-300" />
        <p className="mt-3 text-sm font-medium text-slate-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Horizontal scroll container for responsive table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          {/* Table Header with 15 columns */}
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                Starting Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                Application Deadline
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                Company
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                Course / Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                Internship Mode
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                Compensation
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                Paid / Unpaid
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                Certificate
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                Required Skills
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                AI Match
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                Company Rating
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                Application Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                View Details
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 bg-white">
            {internships.map((internship) => {
              const isExpanded = expandedSkills[internship._id];
              const allSkills = internship.requiredSkills || [];
              const displaySkills = internship.displaySkills || [];
              const remainingSkills = internship.displaySkillsRemaining || 0;

              return (
                <tr 
                  key={internship._id} 
                  className="hover:bg-slate-50 transition-colors"
                >
                  {/* Column 1: Starting Date */}
                  <td className="px-4 py-4 text-sm text-slate-700 whitespace-nowrap">
                    {internship.displayStartingDate}
                  </td>

                  {/* Column 2: Application Deadline */}
                  <td className="px-4 py-4 text-sm text-slate-700 whitespace-nowrap">
                    {internship.displayDeadline}
                  </td>

                  {/* Column 3: Company */}
                  <td className="px-4 py-4">
                    <button
                      onClick={() => internship.companyId?._id && navigate(`/company/${internship.companyId._id}`)}
                      className="flex items-center gap-2 hover:opacity-80 transition"
                      disabled={!internship.companyId?._id}
                    >
                      {internship.displayCompanyLogo && (
                        <img 
                          src={internship.displayCompanyLogo} 
                          alt={internship.displayCompany}
                          className="h-8 w-8 rounded object-contain"
                        />
                      )}
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800 text-sm whitespace-nowrap hover:text-emerald-700">
                          {internship.displayCompany}
                        </span>
                        {internship.displayCompanyVerified && (
                          <CheckCircle size={12} className="text-emerald-600 shrink-0" />
                        )}
                        {internship.isDemoData && (
                          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
                            Demo Data
                          </span>
                        )}
                      </div>
                    </button>
                  </td>

                  {/* Column 4: Course / Role */}
                  <td className="px-4 py-4">
                    <div className="text-sm font-semibold text-slate-800 max-w-xs">
                      {internship.title || internship.displayCourseRole}
                    </div>
                  </td>

                  {/* Column 5: Location */}
                  <td className="px-4 py-4">
                    <button
                      onClick={() => navigate(`/locations/${internship.displayLocation.toLowerCase()}`)}
                      className="text-sm text-emerald-700 hover:text-emerald-800 font-semibold hover:underline whitespace-nowrap transition"
                      title={`View all internships in ${internship.displayLocation}`}
                    >
                      {internship.displayLocation}
                    </button>
                  </td>

                  {/* Column 6: Duration */}
                  <td className="px-4 py-4 text-sm text-slate-700 whitespace-nowrap">
                    {internship.displayDuration}
                  </td>

                  {/* Column 7: Internship Mode */}
                  <td className="px-4 py-4 text-sm text-slate-700 whitespace-nowrap">
                    {internship.displayMode}
                  </td>

                  {/* Column 8: Compensation */}
                  <td className="px-4 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                    {internship.displayCompensation}
                  </td>

                  {/* Column 9: Paid / Unpaid */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ${
                        internship.displayInternshipType === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : internship.displayInternshipType === 'Unpaid'
                          ? 'bg-slate-100 text-slate-600 border border-slate-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {internship.displayInternshipType}
                    </span>
                  </td>

                  {/* Column 10: Certificate */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <CertificateBadge 
                      certificateType={internship.certificateType || internship.displayCertificate} 
                      size="sm"
                    />
                  </td>

                  {/* Column 11: Required Skills */}
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {displaySkills[0] === 'Not Disclosed' ? (
                        <span className="text-sm text-slate-500">Not Disclosed</span>
                      ) : (
                        <>
                          {(isExpanded ? allSkills : displaySkills).map((skill, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 border border-emerald-200"
                            >
                              {skill}
                            </span>
                          ))}
                          {remainingSkills > 0 && !isExpanded && (
                            <button
                              onClick={() => toggleSkills(internship._id)}
                              className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                              +{remainingSkills} More
                            </button>
                          )}
                          {isExpanded && allSkills.length > displaySkills.length && (
                            <button
                              onClick={() => toggleSkills(internship._id)}
                              className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                              Show Less
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>

                  {/* Column 12: AI Match */}
                  <td className="px-4 py-4 text-sm font-semibold text-emerald-700 whitespace-nowrap">
                    {internship.displayAIMatch}
                  </td>

                  {/* Column 13: Company Rating */}
                  <td className="px-4 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                    {internship.displayCompanyRating}
                  </td>

                  {/* Column 14: Application Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ${
                        internship.displayApplicationStatus === 'Open'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : internship.displayApplicationStatus === 'Closed'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {internship.displayApplicationStatus}
                    </span>
                  </td>

                  {/* Column 15: View Details */}
                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => onViewDetails(internship)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-800 active:scale-95"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
