import { FileText, Mail, X, HelpCircle } from 'lucide-react';

/**
 * CertificateBadge - Displays certificate type with appropriate icon and styling
 * 
 * Types:
 * - Hard Copy: 📄 Physical certificate
 * - Soft Copy: 📧 Digital certificate
 * - Both: 📄📧 Both physical and digital
 * - Not Provided: ❌ No certificate
 * - Not Disclosed: ❓ Information not available
 */
export default function CertificateBadge({ certificateType, size = 'md', showLabel = true }) {
  const getConfig = () => {
    switch (certificateType) {
      case 'Hard Copy':
        return {
          icon: <FileText className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />,
          label: 'Hard Copy',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
        };
      case 'Soft Copy':
        return {
          icon: <Mail className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />,
          label: 'Soft Copy',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-700',
          borderColor: 'border-purple-200',
        };
      case 'Both':
        return {
          icon: (
            <div className="flex items-center gap-0.5">
              <FileText className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
              <Mail className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
            </div>
          ),
          label: 'Both',
          bgColor: 'bg-emerald-50',
          textColor: 'text-emerald-700',
          borderColor: 'border-emerald-200',
        };
      case 'Not Provided':
      case 'No Certificate':
        return {
          icon: <X className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />,
          label: 'Not Provided',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
        };
      case 'Not Disclosed':
      default:
        return {
          icon: <HelpCircle className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />,
          label: 'Not Disclosed',
          bgColor: 'bg-slate-100',
          textColor: 'text-slate-600',
          borderColor: 'border-slate-200',
        };
    }
  };

  const config = getConfig();
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-4 py-2 text-base' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-semibold ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses}`}
      title={`Certificate Type: ${config.label}`}
    >
      {config.icon}
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
