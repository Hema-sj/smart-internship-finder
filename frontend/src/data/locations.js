export const CANONICAL_LOCATIONS = [
  'Chennai',
  'Bangalore',
  'Coimbatore',
  'Hyderabad',
  'Pune',
  'Mumbai',
  'Delhi',
  'Kochi',
  'Kolkata',
  'Ahmedabad',
  'Noida',
  'Gurugram',
  'New Delhi',
  'Dehradun',
  'Bhubaneswar',
  'Guwahati',
  'Gandhinagar',
  'Thiruvananthapuram',
  'Jaipur',
  'Ludhiana',
  'Jodhpur',
  'Remote',
];

// Map locations to official company career websites
export const LOCATION_CAREER_LINKS = {
  'Chennai': [
    { company: 'TCS', url: 'https://www.tcs.com/careers/india/internship' },
    { company: 'Infosys', url: 'https://www.infosys.com/careers/apply/students.html' },
    { company: 'Wipro', url: 'https://careers.wipro.com/' },
    { company: 'Zoho', url: 'https://www.zoho.com/careers/' },
    { company: 'Freshworks', url: 'https://www.freshworks.com/company/careers/' },
    { company: 'PayPal', url: 'https://careers.pypl.com/' },
    { company: 'JSM Technologies', url: 'https://jsmtechnologies.com/Careers/internshipopportunities.aspx' },
  ],
  'Bangalore': [
    { company: 'Google', url: 'https://www.google.com/about/careers/applications/' },
    { company: 'Microsoft', url: 'https://careers.microsoft.com/v2/global/en/students' },
    { company: 'IBM', url: 'https://www.ibm.com/in-en/careers/internships' },
    { company: 'Cisco', url: 'https://jobs.cisco.com/' },
    { company: 'Intel', url: 'https://jobs.intel.com/' },
    { company: 'Oracle', url: 'https://careers.oracle.com/' },
    { company: 'SAP', url: 'https://www.sap.com/about/careers.html' },
    { company: 'Qualcomm', url: 'https://www.qualcomm.com/company/careers' },
    { company: 'Accenture', url: 'https://www.accenture.com/in-en/careers' },
    { company: 'JSM Technologies', url: 'https://jsmtechnologies.com/Careers/internshipopportunities.aspx' },
  ],
  'Hyderabad': [
    { company: 'Amazon', url: 'https://www.amazon.jobs/content/en/career-programs/university/internships-for-students' },
    { company: 'Microsoft', url: 'https://careers.microsoft.com/v2/global/en/students' },
    { company: 'Salesforce', url: 'https://careers.salesforce.com/en/university-recruiting/' },
    { company: 'JSM Technologies', url: 'https://jsmtechnologies.com/Careers/internshipopportunities.aspx' },
  ],
  'Pune': [
    { company: 'NVIDIA', url: 'https://www.nvidia.com/en-us/about-nvidia/careers/' },
    { company: 'Tech Mahindra', url: 'https://careers.techmahindra.com/' },
    { company: 'Cognizant', url: 'https://careers.cognizant.com/' },
    { company: 'JSM Technologies', url: 'https://jsmtechnologies.com/Careers/internshipopportunities.aspx' },
  ],
  'Mumbai': [
    { company: 'Deloitte', url: 'https://www.deloitte.com/in/en/careers/students.html' },
    { company: 'Accenture', url: 'https://www.accenture.com/in-en/careers' },
    { company: 'JSM Technologies', url: 'https://jsmtechnologies.com/Careers/internshipopportunities.aspx' },
  ],
  'Delhi': [
    { company: 'Adobe', url: 'https://careers.adobe.com/' },
    { company: 'HCL Technologies', url: 'https://www.hcltech.com/careers' },
  ],
  'New Delhi': [
    { company: 'Adobe', url: 'https://careers.adobe.com/' },
    { company: 'HCL Technologies', url: 'https://www.hcltech.com/careers' },
    { company: 'JSM Technologies', url: 'https://jsmtechnologies.com/Careers/internshipopportunities.aspx' },
  ],
  'Noida': [
    { company: 'Adobe', url: 'https://careers.adobe.com/' },
    { company: 'JSM Technologies', url: 'https://jsmtechnologies.com/Careers/internshipopportunities.aspx' },
  ],
  'Gurugram': [
    { company: 'Google', url: 'https://www.google.com/about/careers/applications/' },
    { company: 'Microsoft', url: 'https://careers.microsoft.com/v2/global/en/students' },
    { company: 'JSM Technologies', url: 'https://jsmtechnologies.com/Careers/internshipopportunities.aspx' },
  ],
  'Coimbatore': [
    { company: 'TCS', url: 'https://www.tcs.com/careers/india/internship' },
    { company: 'Infosys', url: 'https://www.infosys.com/careers/apply/students.html' },
    { company: 'JSM Technologies', url: 'https://jsmtechnologies.com/Careers/internshipopportunities.aspx' },
  ],
  'Kochi': [
    { company: 'TCS', url: 'https://www.tcs.com/careers/india/internship' },
    { company: 'Infosys', url: 'https://www.infosys.com/careers/apply/students.html' },
    { company: 'JSM Technologies', url: 'https://jsmtechnologies.com/Careers/internshipopportunities.aspx' },
  ],
  'Kolkata': [
    { company: 'TCS', url: 'https://www.tcs.com/careers/india/internship' },
    { company: 'Wipro', url: 'https://careers.wipro.com/' },
    { company: 'JSM Technologies', url: 'https://jsmtechnologies.com/Careers/internshipopportunities.aspx' },
  ],
  'Ahmedabad': [
    { company: 'Infosys', url: 'https://www.infosys.com/careers/apply/students.html' },
    { company: 'TCS', url: 'https://www.tcs.com/careers/india/internship' },
    { company: 'JSM Technologies', url: 'https://jsmtechnologies.com/Careers/internshipopportunities.aspx' },
  ],
  'Dehradun': [
    { company: 'Goonj', url: 'https://goonj.org/internship/' },
  ],
  'Bhubaneswar': [
    { company: 'STPI', url: 'https://stpi.in/en/jobs' },
  ],
  'Guwahati': [
    { company: 'STPI', url: 'https://stpi.in/en/jobs' },
  ],
  'Gandhinagar': [
    { company: 'STPI', url: 'https://stpi.in/en/jobs' },
  ],
  'Thiruvananthapuram': [
    { company: 'STPI', url: 'https://stpi.in/en/jobs' },
    { company: 'TCS', url: 'https://www.tcs.com/careers/india/internship' },
  ],
  'Jaipur': [
    { company: 'Hellmann India', url: 'https://careers.hellmann.com/en/india' },
    { company: 'Infosys', url: 'https://www.infosys.com/careers/apply/students.html' },
  ],
  'Ludhiana': [
    { company: 'Hellmann India', url: 'https://careers.hellmann.com/en/india' },
  ],
  'Jodhpur': [
    { company: 'Hellmann India', url: 'https://careers.hellmann.com/en/india' },
  ],
  'Remote': [
    { company: 'Google', url: 'https://www.google.com/about/careers/applications/' },
    { company: 'Microsoft', url: 'https://careers.microsoft.com/v2/global/en/students' },
    { company: 'Amazon', url: 'https://www.amazon.jobs/content/en/career-programs/university/internships-for-students' },
    { company: 'Adobe', url: 'https://careers.adobe.com/' },
    { company: 'Salesforce', url: 'https://careers.salesforce.com/en/university-recruiting/' },
  ],
};

export const LOCATION_GRADIENTS = {
  Chennai:              'from-rose-500 to-orange-400',
  Bangalore:            'from-violet-600 to-indigo-500',
  Coimbatore:           'from-emerald-600 to-teal-500',
  Hyderabad:            'from-blue-600 to-cyan-500',
  Pune:                 'from-amber-500 to-yellow-400',
  Mumbai:               'from-pink-600 to-rose-500',
  Delhi:                'from-red-600 to-orange-500',
  'New Delhi':          'from-red-600 to-orange-500',
  Kochi:                'from-teal-600 to-green-500',
  Kolkata:              'from-purple-600 to-pink-500',
  Ahmedabad:            'from-orange-600 to-amber-500',
  Noida:                'from-indigo-600 to-blue-500',
  Gurugram:             'from-cyan-600 to-teal-500',
  Dehradun:             'from-green-600 to-emerald-500',
  Bhubaneswar:          'from-yellow-600 to-orange-500',
  Guwahati:             'from-lime-600 to-green-500',
  Gandhinagar:          'from-amber-600 to-yellow-500',
  Thiruvananthapuram:   'from-teal-700 to-cyan-600',
  Jaipur:               'from-pink-700 to-rose-600',
  Ludhiana:             'from-violet-700 to-purple-600',
  Jodhpur:              'from-blue-700 to-indigo-600',
  Remote:               'from-slate-600 to-slate-500',
};

export function emptyLocationStat(location) {
  return { location, total: 0, paid: 0, unpaid: 0 };
}

export function mergeLocationStats(stats = []) {
  const map = Object.fromEntries(
    (stats || []).map((row) => [String(row.location || '').toLowerCase(), row]),
  );

  const canonical = CANONICAL_LOCATIONS.map((location) => {
    const row = map[location.toLowerCase()];
    return row ? { ...emptyLocationStat(location), ...row, location } : emptyLocationStat(location);
  });

  const extras = (stats || []).filter(
    (row) => !CANONICAL_LOCATIONS.some(
      (name) => name.toLowerCase() === String(row.location || '').toLowerCase(),
    ),
  );

  return [...canonical, ...extras];
}
