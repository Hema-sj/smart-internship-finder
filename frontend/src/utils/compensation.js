export const COMPENSATION_TYPES = {
  PAID: 'Paid',
  UNPAID: 'Unpaid',
  NOT_DISCLOSED: 'Stipend Not Disclosed',
};

export function formatStipend(stipend) {
  return `₹${Number(stipend || 0).toLocaleString('en-IN')}/month`;
}

export function getCompensationBadgeLabel(compensationType) {
  if (compensationType === COMPENSATION_TYPES.PAID) return 'PAID';
  if (compensationType === COMPENSATION_TYPES.UNPAID) return 'UNPAID';
  if (compensationType === COMPENSATION_TYPES.NOT_DISCLOSED) return 'STIPEND NOT DISCLOSED';
  return compensationType?.toUpperCase() || 'UNKNOWN';
}

export function getCompensationBadgeClass(compensationType) {
  if (compensationType === COMPENSATION_TYPES.PAID) {
    return 'bg-emerald-600 text-white';
  }
  if (compensationType === COMPENSATION_TYPES.UNPAID) {
    return 'bg-orange-600 text-white';
  }
  if (compensationType === COMPENSATION_TYPES.NOT_DISCLOSED) {
    return 'bg-slate-500 text-white';
  }
  return 'bg-slate-400 text-white';
}

export function getCompensationSummary(internship) {
  const type = internship?.compensationType;

  if (type === COMPENSATION_TYPES.PAID) {
    return {
      amount: formatStipend(internship.stipend),
      subtitle: '(Paid)',
      badgeLabel: 'PAID',
      badgeClass: getCompensationBadgeClass(type),
    };
  }

  if (type === COMPENSATION_TYPES.UNPAID) {
    return {
      amount: 'Unpaid',
      subtitle: null,
      badgeLabel: 'UNPAID',
      badgeClass: getCompensationBadgeClass(type),
    };
  }

  if (type === COMPENSATION_TYPES.NOT_DISCLOSED) {
    return {
      amount: 'Stipend Not Disclosed',
      subtitle: null,
      badgeLabel: 'STIPEND NOT DISCLOSED',
      badgeClass: getCompensationBadgeClass(type),
    };
  }

  return {
    amount: '—',
    subtitle: null,
    badgeLabel: 'UNKNOWN',
    badgeClass: getCompensationBadgeClass(type),
  };
}
