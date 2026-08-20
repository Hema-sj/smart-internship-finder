import { MapPin } from 'lucide-react';
import { CANONICAL_LOCATIONS } from '../data/locations';

export default function LocationFilter({
  value = '',
  onChange,
  locations = CANONICAL_LOCATIONS,
  allowAll = true,
}) {
  const options = allowAll ? ['All', ...locations] : locations;

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
              onClick={() => onChange?.(location === 'All' ? '' : location)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                selected
                  ? 'border-emerald-700 bg-emerald-700 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
              }`}
            >
              {location === 'All' ? 'All locations' : location}
            </button>
          );
        })}
      </div>
    </div>
  );
}
