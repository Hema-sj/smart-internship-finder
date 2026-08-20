import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import LocationGrid from '../components/LocationGrid';
import { fetchLocations } from '../services/internshipService';
import { mergeLocationStats } from '../data/locations';

export default function Locations() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

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
    navigate(`/internships?location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Locations</p>
        <h1 className="mt-1 text-3xl font-extrabold text-slate-900">Find internships by location</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Choose a preferred city or Remote. You will only see internships available in that location.
          {offline && (
            <span className="ml-2 inline-flex items-center gap-1 text-xs text-amber-600">
              <AlertCircle size={11} /> Showing location list without live counts
            </span>
          )}
        </p>
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
