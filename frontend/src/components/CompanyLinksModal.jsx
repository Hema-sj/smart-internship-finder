import { X, ExternalLink, MapPin } from 'lucide-react';
import { LOCATION_CAREER_LINKS } from '../data/locations';

export default function CompanyLinksModal({ location, onClose }) {
  console.log('=== CompanyLinksModal Rendered ===');
  console.log('Props received - location:', location);
  console.log('Props received - onClose:', typeof onClose);
  
  if (!location) {
    console.log('Modal: No location provided, returning null');
    return null;
  }

  // Normalize location name - handle case variations and extra spaces
  const normalizedLocation = location.trim();
  
  // Try exact match first
  let companies = LOCATION_CAREER_LINKS[normalizedLocation];
  
  // If no exact match, try case-insensitive match
  if (!companies) {
    const matchingKey = Object.keys(LOCATION_CAREER_LINKS).find(
      key => key.toLowerCase() === normalizedLocation.toLowerCase()
    );
    companies = matchingKey ? LOCATION_CAREER_LINKS[matchingKey] : [];
  }
  
  console.log('Modal received location:', location);
  console.log('Normalized location:', normalizedLocation);
  console.log('Companies found:', companies);
  console.log('Companies length:', companies?.length || 0);
  console.log('Available locations:', Object.keys(LOCATION_CAREER_LINKS));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-w-3xl w-full max-h-[80vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Company Career Links - {location}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {companies.length > 0 ? (
            <>
              <p className="text-sm text-slate-600 mb-4">
                Click any company below to visit their official careers portal:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {companies.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-4 rounded-lg border-2 border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all bg-white"
                  >
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-600">
                        {item.company}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">Careers Portal</p>
                    </div>
                    <ExternalLink size={18} className="text-slate-400 group-hover:text-emerald-600 ml-3 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500">No company links available for {location} yet.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
