import { useEffect, useState } from 'react';
import { Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import LocationGrid from '../components/LocationGrid';
import { fetchLocations } from '../services/internshipService';
import { mergeLocationStats, LOCATION_CAREER_LINKS } from '../data/locations';

export default function Locations() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    fetchLocations()
      .then((data) => {
        setStats(data.locations || data);
        setOffline(false);
      })
      .catch(() => {
        setStats(mergeLocationStats([]));
        setOffline(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleBack = () => {
    setSelectedLocation(null);
  };

  // Show company links for selected location
  if (selectedLocation) {
    const companies = LOCATION_CAREER_LINKS[selectedLocation] || [];
    
    return (
      <div className="space-y-8">
        <div>
          <button
            onClick={handleBack}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium mb-4"
          >
            ← Back to locations
          </button>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            {selectedLocation} Internships
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900">
            Official Company Career Pages
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Click any link below to visit the company's official careers portal
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-6 rounded-xl border-2 border-slate-200 bg-white hover:border-emerald-500 hover:shadow-lg transition-all"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600">
                  {item.company}
                </h3>
                <p className="text-sm text-slate-500 mt-1">Careers Portal</p>
              </div>
              <ExternalLink size={20} className="text-slate-400 group-hover:text-emerald-600" />
            </a>
          ))}
        </div>

        {companies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No companies listed for this location yet.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Browse by location</p>
        <h1 className="mt-1 text-3xl font-extrabold text-slate-900">Select a city to see internships available only there.</h1>
        {offline && (
          <p className="mt-2 text-sm text-amber-600 flex items-center gap-2">
            <AlertCircle size={14} /> Showing location list without live counts
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-24 text-slate-500">
          <Loader2 size={24} className="animate-spin text-emerald-600" />
          <span className="text-sm">Loading locations…</span>
        </div>
      ) : (
        <LocationGrid stats={stats} onSelect={handleSelect} />
      )}
    </div>
  );
}
