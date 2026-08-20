import { MapPin } from 'lucide-react';
import { LOCATION_GRADIENTS } from '../data/locations';

export default function LocationCard({
  location,
  total = 0,
  paid = 0,
  unpaid = 0,
  onClick,
  selected = false,
}) {
  const gradient = LOCATION_GRADIENTS[location] || 'from-slate-600 to-slate-500';
  const internshipLabel = `${Number(total).toLocaleString('en-IN')} Internship${total === 1 ? '' : 's'}`;

  return (
    <button
      type="button"
      onClick={() => onClick?.(location)}
      aria-label={`Browse internships in ${location}`}
      aria-pressed={selected}
      className={`group w-full overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
        selected ? 'ring-2 ring-emerald-500' : 'ring-slate-200'
      }`}
    >
      <div className={`bg-gradient-to-br ${gradient} px-4 py-4 sm:px-5 sm:py-5`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <MapPin size={18} className="text-white" />
          </div>
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold text-white">
            {internshipLabel}
          </span>
        </div>
        <h3 className="mt-3 text-xl font-extrabold text-white sm:text-2xl">{location}</h3>
        <p className="mt-1 text-sm font-semibold text-white/90">{internshipLabel}</p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-slate-100 px-4 py-3 sm:px-5">
        <div>
          <p className="text-lg font-extrabold text-emerald-700">{Number(paid).toLocaleString('en-IN')}</p>
          <p className="text-xs font-semibold text-slate-500">Paid: {Number(paid).toLocaleString('en-IN')}</p>
        </div>
        <div className="pl-4">
          <p className="text-lg font-extrabold text-amber-600">{Number(unpaid).toLocaleString('en-IN')}</p>
          <p className="text-xs font-semibold text-slate-500">Unpaid: {Number(unpaid).toLocaleString('en-IN')}</p>
        </div>
      </div>
    </button>
  );
}
