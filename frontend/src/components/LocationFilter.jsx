import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CANONICAL_LOCATIONS } from '../data/locations';

export default function LocationFilter({
  value = '',
  onChange,
  locations = CANONICAL_LOCATIONS,
  allowAll = true,
  enableNavigation = false, // New prop to enable navigation to location pages
}) {
  const navigate = useNavigate();
  const options = allowAll ? ['All', ...locations] : locations;

  const handleLocationClick = (location) => {
    if (enableNavigation && location !== 'All') {
      // Navigate to location page
      navigate(`/locations/${location.toLowerCase()}`);
    } else {
      // Filter current page
      onChange?.(location === 'All' ? '' : location);
    }
  };

  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-500">
        <MapPin size={12} className="text-emerald-600" /> Preferred location
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 sm:flex-wrap sm:overflow-visible">
        {options.map((location) => {
          const selected = location === 'All' ? !value : value === location;
          return (
            <button
              key={location}
              type="button"
              onClick={() => handleLocationClick(location)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                selected
                  ? 'border-emerald-700 bg-emerald-700 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
              }`}
              title={enableNavigation && location !== 'All' ? `View all internships in ${location}` : undefined}
            >
              {location === 'All' ? 'All locations' : location}
            </button>
          );
        })}
      </div>
    </div>
  );
}
