import { useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { CANONICAL_LOCATIONS, LOCATION_CAREER_LINKS } from '../data/locations';

export default function CompanyLinksPage() {
  const [selectedLocation, setSelectedLocation] = useState('');

  const companyLinks = selectedLocation ? (LOCATION_CAREER_LINKS[selectedLocation] || []) : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Company Career Links</h1>
        <p className="mt-2 text-sm text-slate-600">
          Select a city to see official company career pages
        </p>
      </div>

      {/* Location Buttons */}
      <div>
        <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-500">
          <MapPin size={12} className="text-emerald-600" /> Select Location
        </p>
        <div className="flex flex-wrap gap-2">
          {CANONICAL_LOCATIONS.map((location) => {
            const isSelected = selectedLocation === location;
            return (
              <button
                key={location}
                type="button"
                onClick={() => setSelectedLocation(location)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-700 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
                }`}
              >
                {location}
              </button>
            );
          })}
        </div>
      </div>

      {/* Company Links */}
      {selectedLocation && companyLinks.length > 0 && (
        <div className="rounded-xl border-2 border-emerald-100 bg-emerald-50 p-6">
          <h3 className="text-lg font-bold text-emerald-900 mb-3 flex items-center gap-2">
            <MapPin size={20} />
            Official Company Career Pages in {selectedLocation}
          </h3>
          <p className="text-sm text-emerald-700 mb-5">
            Click any company below to visit their official careers portal ↓
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companyLinks.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-5 rounded-lg border-2 border-white bg-white hover:border-emerald-500 hover:shadow-lg transition-all"
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
        </div>
      )}

      {/* No location selected */}
      {!selectedLocation && (
        <div className="rounded-xl border-2 border-blue-100 bg-blue-50 p-8 text-center">
          <h3 className="text-lg font-bold text-blue-900 mb-2">
            👆 Select a city above
          </h3>
          <p className="text-sm text-blue-700">
            Choose any location to see official company career pages for that city!
          </p>
        </div>
      )}

      {/* No companies for location */}
      {selectedLocation && companyLinks.length === 0 && (
        <div className="rounded-xl border-2 border-amber-100 bg-amber-50 p-8 text-center">
          <h3 className="text-lg font-bold text-amber-900 mb-2">
            No companies listed yet
          </h3>
          <p className="text-sm text-amber-700">
            We haven't added company links for {selectedLocation} yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
