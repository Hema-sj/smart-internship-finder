/**
 * URL Validation Utilities
 * Ensures only valid, official company URLs are used for applications
 */

/**
 * Validate if a URL is safe and properly formatted
 */
export function isValidUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    return false;
  }

  try {
    const url = new URL(urlString);
    
    // Must be HTTPS (secure)
    if (url.protocol !== 'https:') {
      return false;
    }

    // Must have a valid hostname
    if (!url.hostname || url.hostname.length < 4) {
      return false;
    }

    // Block localhost, IP addresses, and suspicious domains
    const suspiciousPatterns = [
      /^localhost$/i,
      /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,  // IP addresses
      /^127\./,  // Loopback
      /^192\.168\./,  // Private network
      /^10\./,  // Private network
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // Private network
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(url.hostname)) {
        return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Validate if URL belongs to a known company career portal
 */
export function isOfficialCareerUrl(urlString) {
  if (!isValidUrl(urlString)) {
    return false;
  }

  try {
    const url = new URL(urlString);
    const hostname = url.hostname.toLowerCase();

    // List of known official career portal domains
    const officialDomains = [
      'careers.google.com',
      'careers.microsoft.com',
      'amazon.jobs',
      'zoho.com',
      'careers.ibm.com',
      'tcs.com',
      'infosys.com',
      'accenture.com',
      'wipro.com',
      'deloitte.com',
      'freshworks.com',
      'cisco.com',
      'oracle.com',
      'apple.com',
      'meta.com',
      'facebook.com',
      'netflix.com',
      'linkedin.com',
      'salesforce.com',
      'adobe.com',
      'intel.com',
      'nvidia.com',
      'samsung.com'
    ];

    // Check if hostname ends with any official domain
    for (const domain of officialDomains) {
      if (hostname === domain || hostname.endsWith('.' + domain)) {
        return true;
      }
    }

    // Check for common career path patterns
    const careerPathPatterns = [
      /\/careers?\//i,
      /\/jobs\//i,
      /\/internships?\//i,
      /\/students?\//i,
      /\/university/i
    ];

    const pathname = url.pathname.toLowerCase();
    for (const pattern of careerPathPatterns) {
      if (pattern.test(pathname)) {
        return true;
      }
    }

    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Sanitize and format URL for display
 */
export function sanitizeUrl(urlString) {
  if (!urlString) return null;

  try {
    const url = new URL(urlString);
    return url.href;  // Returns fully qualified URL
  } catch (error) {
    return null;
  }
}

/**
 * Get display name from URL (for showing shortened version)
 */
export function getUrlDisplayName(urlString) {
  if (!urlString) return '';

  try {
    const url = new URL(urlString);
    return url.hostname.replace('www.', '');
  } catch (error) {
    return urlString;
  }
}

/**
 * Validate internship application data
 */
export function validateApplicationUrl(internship) {
  const errors = [];

  // Check if application URL exists
  if (!internship.applicationUrl) {
    errors.push('Application URL is required');
    return { isValid: false, errors };
  }

  // Validate URL format
  if (!isValidUrl(internship.applicationUrl)) {
    errors.push('Application URL is not valid or not secure (must use HTTPS)');
  }

  // Check if internship is still accepting applications
  if (internship.applicationStatus !== 'Open') {
    errors.push(`Internship is ${internship.applicationStatus.toLowerCase()}`);
  }

  // Check if application deadline has passed
  if (internship.applicationDeadline) {
    const deadline = new Date(internship.applicationDeadline);
    const now = new Date();
    if (deadline < now) {
      errors.push('Application deadline has passed');
    }
  }

  // Check if internship is approved
  if (internship.status !== 'Approved') {
    errors.push('Internship is not approved yet');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export default {
  isValidUrl,
  isOfficialCareerUrl,
  sanitizeUrl,
  getUrlDisplayName,
  validateApplicationUrl
};
