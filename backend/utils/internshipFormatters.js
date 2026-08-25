/**
 * Utility functions to format internship data for display
 * Handles "Not Disclosed" and "Not Announced" cases
 */

/**
 * Format starting date for display
 * @param {Date|null} date - Starting date
 * @returns {string} Formatted date or "Not Announced"
 */
export function formatStartingDate(date) {
  if (!date) return 'Not Announced';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Not Announced';
    
    return dateObj.toLocaleDateString('en-IN', { 
      month: 'short', 
      year: 'numeric' 
    });
  } catch (error) {
    return 'Not Announced';
  }
}

/**
 * Format application deadline for display
 * @param {Date|null} date - Application deadline
 * @returns {string} Formatted date or "Not Announced"
 */
export function formatDeadline(date) {
  if (!date) return 'Not Announced';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Not Announced';
    
    return dateObj.toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short', 
      year: 'numeric' 
    });
  } catch (error) {
    return 'Not Announced';
  }
}

/**
 * Format duration for display
 * @param {string|null} duration - Duration string
 * @returns {string} Duration or "Not Disclosed"
 */
export function formatDuration(duration) {
  if (!duration || duration.trim() === '') return 'Not Disclosed';
  return duration;
}

/**
 * Format compensation for display
 * @param {string} compensationType - "Paid", "Unpaid", or "Not Disclosed"
 * @param {number|null} stipend - Stipend amount
 * @returns {string} Formatted compensation
 */
export function formatCompensation(compensationType, stipend) {
  if (compensationType === 'Not Disclosed' || !compensationType) {
    return 'Not Disclosed';
  }
  
  if (compensationType === 'Unpaid') {
    return 'Unpaid';
  }
  
  if (compensationType === 'Paid') {
    if (stipend === null || stipend === undefined || stipend === 0) {
      return 'Not Disclosed';
    }
    return `₹${stipend.toLocaleString('en-IN')}/month`;
  }
  
  return 'Not Disclosed';
}

/**
 * Format internship type for display
 * @param {string} compensationType - "Paid", "Unpaid", or "Not Disclosed"
 * @returns {string} Internship type
 */
export function formatInternshipType(compensationType) {
  if (!compensationType || compensationType === 'Not Disclosed') {
    return 'Not Disclosed';
  }
  return compensationType;
}

/**
 * Format required skills for display
 * @param {Array<string>} skills - Array of skills
 * @param {number} maxDisplay - Maximum number of skills to display
 * @returns {Object} { displayed: string[], remaining: number }
 */
export function formatSkills(skills, maxDisplay = 3) {
  if (!skills || skills.length === 0) {
    return { displayed: ['Not Disclosed'], remaining: 0 };
  }
  
  const displayed = skills.slice(0, maxDisplay);
  const remaining = Math.max(0, skills.length - maxDisplay);
  
  return { displayed, remaining };
}

/**
 * Format company name with verification badge
 * @param {Object} company - Company object
 * @returns {Object} { name: string, verified: boolean }
 */
export function formatCompany(company) {
  if (!company) {
    return { name: 'Unknown Company', verified: false };
  }
  
  return {
    name: company.companyName || company.name || 'Unknown Company',
    verified: company.verified_status === 'approved' || company.verified === true,
    logo: company.logo || null
  };
}

/**
 * Format certificate type for display
 * @param {string|null} certificateType - Certificate type
 * @returns {string} Formatted certificate type
 */
export function formatCertificate(certificateType) {
  if (!certificateType || certificateType === 'Not Disclosed') {
    return 'Not Disclosed';
  }
  return certificateType;
}

/**
 * Format internship mode for display
 * @param {string|null} mode - Internship mode
 * @returns {string} Formatted mode
 */
export function formatMode(mode) {
  if (!mode) return 'Not Disclosed';
  return mode;
}

/**
 * Format AI match percentage
 * @param {number} aiMatch - AI match percentage
 * @returns {string} Formatted AI match with %
 */
export function formatAIMatch(aiMatch) {
  if (aiMatch === null || aiMatch === undefined) return 'N/A';
  return `${Math.round(aiMatch)}%`;
}

/**
 * Format company rating
 * @param {number|null} rating - Company rating out of 5
 * @returns {string} Formatted rating
 */
export function formatCompanyRating(rating) {
  if (rating === null || rating === undefined) return 'Not Rated';
  return `${rating.toFixed(1)}/5`;
}

/**
 * Format application status
 * @param {string} status - Application status
 * @returns {string} Formatted status
 */
export function formatApplicationStatus(status) {
  if (!status) return 'Open';
  return status;
}

/**
 * Format official link for display
 * @param {string|null} applicationUrl - Application URL
 * @param {string|null} internshipDetailsUrl - Details URL
 * @returns {Object} { url: string|null, available: boolean }
 */
export function formatOfficialLink(applicationUrl, internshipDetailsUrl) {
  const url = applicationUrl || internshipDetailsUrl || null;
  return {
    url,
    available: !!url
  };
}

/**
 * Enhance internship object with formatted display values
 * @param {Object} internship - Raw internship object from database
 * @returns {Object} Internship with additional formatted fields
 */
export function enhanceInternshipForDisplay(internship) {
  const company = formatCompany(internship.companyId);
  const skills = formatSkills(internship.requiredSkills);
  const officialLink = formatOfficialLink(internship.applicationUrl, internship.internshipDetailsUrl);
  
  return {
    ...internship,
    // Formatted display values for all 15 columns
    displayStartingDate: formatStartingDate(internship.startingDate),
    displayDeadline: formatDeadline(internship.applicationDeadline),
    displayCompany: company.name,
    displayCompanyVerified: company.verified,
    displayCompanyLogo: company.logo,
    displayCourseRole: internship.courseRole || internship.title || 'Not Disclosed',
    displayLocation: internship.location || 'Not Disclosed',
    displayDuration: formatDuration(internship.duration),
    displayMode: formatMode(internship.mode),
    displayCompensation: formatCompensation(internship.compensationType, internship.stipend),
    displayInternshipType: formatInternshipType(internship.compensationType),
    displayCertificate: formatCertificate(internship.certificateType),
    displaySkills: skills.displayed,
    displaySkillsRemaining: skills.remaining,
    displayAIMatch: formatAIMatch(internship.aiMatch),
    displayCompanyRating: formatCompanyRating(internship.companyRating),
    displayApplicationStatus: formatApplicationStatus(internship.applicationStatus),
    displayOfficialLink: officialLink.url,
    displayOfficialLinkAvailable: officialLink.available,
    // Verification status
    isRealData: internship.sourceVerified === true,
    isDemoData: internship.sourceVerified !== true
  };
}
