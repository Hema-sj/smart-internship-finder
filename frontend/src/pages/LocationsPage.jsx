import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, Award, Loader2, AlertCircle } from 'lucide-react';
import { fetchLocationStats } from '../services/internshipService';
import { popularLocations, internships as staticData } from '../data/internships';

// ─── Fallback: derive stats from static data ──────────────────────────────────
function getStaticStats() {
  const map = {};
  popularLocations.forEach((loc) => {
    map[loc] = { location: loc, total: 0, paid: 0, unpaid: 0 };
  });
  staticData.forEach((i) => {
    const loc = i.location;
    if (!map[loc]) map[loc] = { location: loc, total: 0, paid: 0, unpaid: 0 };
    map[loc].total++;
    if (i.type === 'Paid' || i.compensationType === 'Paid') map[loc].paid++;
    else map[loc].unpaid++;
  });
  return Object.values(map).filter((s) => s.total > 0 || popularLocations.includes(s.location));
}

// ─── Location Card ────────────────────────────────────────────────────────────
const LOCATION_GRADIENTS = {
  Chennai:    'from-rose-500 to-orange-400',
  Bangalore:  'from-violet-600 to-indigo-500',
  Coimbatore: 'from-emerald-600 to-teal-500',
  Hyderabad:  'from-blue-600 to-cyan-500',
  Pune:       'from-amber-500 to-yellow-400',
  Mumbai:     'from-pink-600 to-rose-500',
  Delhi:      'from-red-600 to-orange-500',
  Kochi:      'from-teal-600 to-green-500',
  Remote:     'from-slate-600 to-slate-500',
};

function LocationCard({ stat, onClick }) {
  const gradient = LOCATION_GRADIENTS[stat.location] || 'from-slate-600 to-slate-500';
  const hasData = stat.total > 0;

  return (
    <button
      onClick={() => onClick(stat.location)}
      className="group relative overflow-hidden rounded-2xl text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      aria-label={`Browse internships in ${stat.location}`}
    >
      {/* Gradient header */}
      <div className={`bg-gradient-to-br ${gradient} p-5 pb-8`}>
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <MapPin size={20} className="text-white" />
          </div>
          {hasData && (
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
              {stat.total} open
            </span>
          )}
        </div>
        <h2 className="mt-3 text-xl font-extrabold text-white">{stat.location}</h2>
      </div>

      {/* Stats strip */}
      <div className="relative -mt-4 mx-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
        {hasData ? (
          <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
            <div className="px-2">
              <p className="text-lg font-extrabold text-slate-800">{stat.total}</p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 flex items-center justify-center gap-1">
                <Briefcase size={9} /> Total
              </p>
            </div>
            <div className="px-2">
              <p className="text-lg font-extrabold text-emerald-700">{stat.paid}</p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-500 flex items-center justify-center gap-1">
                <IndianRupee size={9} /> Paid
              </p>
            </div>
            <div className="px-2">
              <p className="text-lg font-extrabold text-amber-600">{stat.unpaid}</p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-500 flex items-center justify-center gap-1">
                <Award size={9} /> Unpaid
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-xs text-slate-400 py-1">No open internships</p>
        )}
      </div>

      {/* Hover CTA */}
      <div className="p-4 pt-3">
        <span className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-center text-xs font-bold text-slate-600 transition group-hover:border-emerald-300 group-hover:bg-emerald-50 group-hover:text-emerald-700">
          Browse internships →
        </span>
      </div>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LocationsPage() {
  const navigate = useNavigate();
  const [stats, setStats]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    fetchLocationStats()
      .then((data) => { setStats(data); setOffline(false); })
      .catch(() => { setStats(getStaticStats()); setOffline(true); })
      .finally(() => setLoading(false));
  }, []);

  const handleClick = (location) => {
    navigate(`/internships?location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Explore</p>
        <h1 className="mt-1 text-3xl font-extrabold text-slate-900">Internships by Location</h1>
        <p className="mt-1 text-sm text-slate-500">
          Discover opportunities in your city or work remotely.
          {offline && (
            <span className="ml-2 inline-flex items-center gap-1 text-xs text-amber-600">
              <AlertCircle size={11} /> offline preview
            </span>
          )}
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-slate-500">
          <Loader2 size={24} className="animate-spin text-emerald-600" />
          <span className="text-sm">Loading locations…</span>
        </div>
      ) : (
        <>
          {/* Ensure all 9 canonical locations always appear */}
          {(() => {
            const statMap = Object.fromEntries(stats.map((s) => [s.location, s]));
            const merged = popularLocations.map((loc) =>
              statMap[loc] ?? { location: loc, total: 0, paid: 0, unpaid: 0 }
            );
            // Append any extra locations from the API not in the canonical list
            stats.forEach((s) => {
              if (!popularLocations.includes(s.location)) merged.push(s);
            });
            return (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {merged.map((stat) => (
                  <LocationCard key={stat.location} stat={stat} onClick={handleClick} />
                ))}
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}
