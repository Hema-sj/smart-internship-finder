import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LocationGrid from './LocationGrid';
import { fetchLocationStats } from '../services/internshipService';

export default function PopularLocations() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocationStats()
      .then((data) => setStats(Array.isArray(data) ? data : data.locations || []))
      .catch(() => setStats([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-bold text-slate-900">Popular Locations</h2>
        <Link to="/locations" className="text-sm font-semibold text-emerald-700 hover:underline">
          View all locations
        </Link>
      </div>
      <div className="mt-5">
        <LocationGrid
          stats={stats}
          loading={loading}
          onSelect={(location) => navigate(`/internships?location=${encodeURIComponent(location)}`)}
        />
      </div>
    </section>
  );
}
