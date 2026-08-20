import LocationCard from './LocationCard';
import { mergeLocationStats } from '../data/locations';

export default function LocationGrid({
  stats = [],
  onSelect,
  selectedLocation = '',
  loading = false,
}) {
  const locations = mergeLocationStats(stats);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="h-44 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {locations.map((stat) => (
        <LocationCard
          key={stat.location}
          location={stat.location}
          total={stat.total}
          paid={stat.paid}
          unpaid={stat.unpaid}
          selected={selectedLocation === stat.location}
          onClick={onSelect}
        />
      ))}
    </div>
  );
}
