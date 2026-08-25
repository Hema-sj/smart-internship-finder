import { Award, FileText, Mail, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import CertificateBadge from './CertificateBadge';

/**
 * CertificateInfo - Displays comprehensive certificate information
 * Used in internship detail pages
 */
export default function CertificateInfo({ internship }) {
  const { certificateProvided, certificateType, certificateDetails, certificateConditions } = internship;

  // Determine certificate status
  const isProvided = certificateProvided === true;
  const isNotProvided = certificateProvided === false || certificateType === 'Not Provided' || certificateType === 'No Certificate';
  const isNotDisclosed = certificateProvided === null || certificateType === 'Not Disclosed';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-5 w-5 text-emerald-600" />
        <h3 className="text-lg font-bold text-slate-900">Certificate Information</h3>
      </div>

      <div className="space-y-4">
        {/* Certificate Status */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {isProvided && <CheckCircle className="h-5 w-5 text-emerald-600" />}
            {isNotProvided && <XCircle className="h-5 w-5 text-red-600" />}
            {isNotDisclosed && <AlertCircle className="h-5 w-5 text-slate-400" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">
              Certificate Provided:{' '}
              <span
                className={`${
                  isProvided
                    ? 'text-emerald-700'
                    : isNotProvided
                    ? 'text-red-700'
                    : 'text-slate-600'
                }`}
              >
                {isProvided ? 'Yes' : isNotProvided ? 'No' : 'Not Disclosed'}
              </span>
            </p>
          </div>
        </div>

        {/* Certificate Type */}
        {isProvided && (
          <div className="rounded-lg bg-slate-50 p-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Certificate Type
              </p>
              <CertificateBadge certificateType={certificateType} size="lg" />
            </div>

            {/* Certificate Format Details */}
            {certificateType === 'Hard Copy' && (
              <div className="flex items-start gap-2 text-sm text-slate-700">
                <FileText className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p>
                  <strong>Hard Copy:</strong> Physical certificate will be provided
                </p>
              </div>
            )}

            {certificateType === 'Soft Copy' && (
              <div className="flex items-start gap-2 text-sm text-slate-700">
                <Mail className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <p>
                  <strong>Soft Copy:</strong> Digital certificate will be sent via email
                </p>
              </div>
            )}

            {certificateType === 'Both' && (
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm text-slate-700">
                  <FileText className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong>Hard Copy:</strong> Physical certificate available
                  </p>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-700">
                  <Mail className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong>Soft Copy:</strong> Digital certificate via email
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Certificate Details */}
        {isProvided && certificateDetails && (
          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Details
            </p>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-700 leading-relaxed">{certificateDetails}</p>
            </div>
          </div>
        )}

        {/* Certificate Conditions */}
        {isProvided && certificateConditions && (
          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Conditions
            </p>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm text-amber-900 leading-relaxed">{certificateConditions}</p>
            </div>
          </div>
        )}

        {/* Not Provided Message */}
        {isNotProvided && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">
              This internship does not provide a certificate upon completion.
            </p>
          </div>
        )}

        {/* Not Disclosed Message */}
        {isNotDisclosed && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-600">
              Certificate information has not been disclosed by the company. Please contact the company directly for more information.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
