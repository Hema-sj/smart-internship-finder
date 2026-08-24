/**
 * Certificate constants & validation for Phase 8 — Certificate Information System.
 */
export const CERTIFICATE_TYPES = ['Hard Copy', 'Soft Copy', 'Both', 'Not Provided', 'Not Disclosed'];

export const CERTIFICATE_PROVIDED_TYPES = ['Hard Copy', 'Soft Copy', 'Both'];

export function normalizeCertificateType(value) {
  if (!value || value === 'All') return null;
  const match = CERTIFICATE_TYPES.find(
    (type) => type.toLowerCase() === String(value).toLowerCase(),
  );
  return match || null;
}

/**
 * Enforces consistency rules between certificateProvided / certificateType:
 *   1. certificateType must be one of the allowed enum values.
 *   2. certificateProvided true  → type should be Hard Copy | Soft Copy | Both
 *                                  (or Not Disclosed when info is unavailable).
 *   3. certificateProvided false → type must be Not Provided.
 *   4. Unknown information       → type can be Not Disclosed.
 *
 * Returns { data } with normalized fields, or { error } with a user-facing message.
 */
export function validateCertificateFields(body = {}) {
  const providedRaw = body.certificateProvided;
  const provided =
    providedRaw === true || providedRaw === 'true' || providedRaw === 'Yes'
      ? true
      : providedRaw === false || providedRaw === 'false' || providedRaw === 'No'
        ? false
        : undefined;

  let type = body.certificateType;

  if (type !== undefined && type !== null && type !== '') {
    if (!CERTIFICATE_TYPES.includes(type)) {
      const normalized = normalizeCertificateType(type);
      if (!normalized) {
        return {
          error: `Invalid certificate type. Must be one of: ${CERTIFICATE_TYPES.join(', ')}`,
        };
      }
      type = normalized;
    }
  }

  // certificateProvided explicitly false → certificateType must be Not Provided
  if (provided === false) {
    return {
      data: {
        certificateProvided: false,
        certificateType: 'Not Provided',
        certificateDetails: '',
        certificateConditions: '',
      },
    };
  }

  // certificateProvided explicitly true → require a real type
  if (provided === true) {
    if (!type || type === 'Not Provided') {
      return { error: 'Please select the certificate type.' };
    }
    if (type !== 'Not Disclosed' && !String(body.certificateDetails || '').trim()) {
      return { error: 'Certificate details are required when a certificate is provided.' };
    }
    return {
      data: {
        certificateProvided: true,
        certificateType: type,
        certificateDetails: String(body.certificateDetails || '').trim(),
        certificateConditions: String(body.certificateConditions || '').trim(),
      },
    };
  }

  // certificateProvided not specified — infer from type when possible
  if (type) {
    if (type === 'Not Provided') {
      return { data: { certificateProvided: false, certificateType: 'Not Provided' } };
    }
    if (CERTIFICATE_PROVIDED_TYPES.includes(type)) {
      if (!String(body.certificateDetails || '').trim()) {
        return { error: 'Certificate details are required when a certificate is provided.' };
      }
      return {
        data: {
          certificateProvided: true,
          certificateType: type,
          certificateDetails: String(body.certificateDetails || '').trim(),
          certificateConditions: String(body.certificateConditions || '').trim(),
        },
      };
    }
    // Not Disclosed without an explicit flag
    return { data: { certificateProvided: false, certificateType: 'Not Disclosed' } };
  }

  // Nothing supplied — leave untouched (defaults apply on create)
  return { data: null };
}
