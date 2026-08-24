import CompensationBadge from './CompensationBadge';
import { getCompensationSummary } from '../utils/compensation';

export default function CompensationDisplay({ internship, layout = 'stacked' }) {
  const summary = getCompensationSummary(internship);

  if (layout === 'inline') {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-slate-800">{summary.amount}</span>
        {summary.subtitle && <span className="text-xs text-emerald-700">{summary.subtitle}</span>}
        <CompensationBadge compensationType={internship.compensationType} />
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <p className="font-semibold text-slate-900">{summary.amount}</p>
      {summary.subtitle && <p className="text-xs font-medium text-emerald-700">{summary.subtitle}</p>}
      <CompensationBadge compensationType={internship.compensationType} />
    </div>
  );
}
