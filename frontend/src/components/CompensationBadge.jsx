import { getCompensationBadgeClass, getCompensationBadgeLabel } from '../utils/compensation';

export default function CompensationBadge({ compensationType, className = '' }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide ${getCompensationBadgeClass(compensationType)} ${className}`}
    >
      {getCompensationBadgeLabel(compensationType)}
    </span>
  );
}
