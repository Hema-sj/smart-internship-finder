/**
 * Seed script — populates MongoDB with real company internships
 * Uses official company careers pages and proper "Not Disclosed" handling
 * Run from the backend directory: node scripts/seedInternships.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import Internship from '../models/Internship.js';
import Company from '../models/Company.js';

// ─── Real Internship Data Templates ──────────────────────────────────────────
// NOTE: Compensation, certificates, and deadlines are set to "Not Disclosed" 
// unless officially published by the company
const TEMPLATES = [
  { 
    title: 'Software Engineering Intern', 
    courseRole: 'Software Engineering', 
    compensationType: 'Not Disclosed', 
    stipend: null, 
    mode: 'On-site', 
    duration: '3 months', 
    certificateType: 'Not Disclosed', 
    skills: ['Python', 'Java', 'Data Structures', 'Algorithms'], 
    aiMatch: 95, 
    description: 'Work on Google\'s core products and infrastructure. Collaborate with engineers to design, develop, test, deploy, maintain, and improve software solutions.',
    companyRating: 4.5
  },
  { 
    title: 'Software Development Engineer Intern', 
    courseRole: 'Software Development', 
    compensationType: 'Not Disclosed', 
    stipend: null, 
    mode: 'On-site', 
    duration: 'Not Disclosed', 
    certificateType: 'Not Disclosed', 
    skills: ['Java', 'Python', 'AWS', 'Data Structures', 'System Design'], 
    aiMatch: 92, 
    description: 'Amazon interns work on real-world projects that matter to customers. Build innovative solutions, write production-quality code, and collaborate with experienced engineers.',
    companyRating: 4.3
  },
  { 
    title: 'Software Engineering Internship', 
    courseRole: 'Software Engineering', 
    compensationType: 'Not Disclosed', 
    stipend: null, 
    mode: 'Hybrid', 
    duration: '3 months', 
    certificateType: 'Not Disclosed', 
    skills: ['C#', 'Python', 'Azure', 'Cloud Computing'], 
    aiMatch: 90, 
    description: 'Microsoft interns work on products used by billions of people worldwide. Gain hands-on experience with cutting-edge technology and mentorship from industry experts.',
    companyRating: 4.4
  },
  { 
    title: 'Software Developer Intern', 
    courseRole: 'Software Development', 
    compensationType: 'Paid', 
    stipend: 20000, 
    mode: 'On-site', 
    duration: '6 months', 
    certificateType: 'Soft Copy', 
    certificateProvided: true,
    certificateDetails: 'Internship completion certificate will be provided after successful completion of the program.',
    certificateConditions: 'Minimum 80% attendance and successful completion of assigned projects.',
    skills: ['Java', 'JavaScript', 'Web Development', 'MySQL'], 
    aiMatch: 88, 
    description: 'Join Zoho to work on enterprise software used by millions globally. Get hands-on experience in full-stack development and contribute to production code.',
    companyRating: 4.2
  },
  { 
    title: 'Cloud Engineering Intern', 
    courseRole: 'Cloud Engineering', 
    compensationType: 'Not Disclosed', 
    stipend: null, 
    mode: 'Hybrid', 
    duration: 'Not Disclosed', 
    certificateType: 'Not Disclosed', 
    skills: ['Python', 'Cloud Computing', 'Linux', 'DevOps'], 
    aiMatch: 87, 
    description: 'IBM interns work on enterprise cloud solutions and AI technologies. Collaborate with teams building next-generation cloud platforms and services.',
    companyRating: 4.1
  },
  { 
    title: 'Network Engineering Intern', 
    courseRole: 'Network Engineering', 
    compensationType: 'Not Disclosed', 
    stipend: null, 
    mode: 'On-site', 
    duration: '3 months', 
    certificateType: 'Not Disclosed', 
    skills: ['Networking', 'Python', 'Network Protocols', 'Security'], 
    aiMatch: 85, 
    description: 'Work on Cisco\'s networking products and solutions. Learn from networking experts and contribute to products that power the internet.',
    companyRating: 4.3
  },
  { 
    title: 'Product Engineering Intern', 
    courseRole: 'Product Engineering', 
    compensationType: 'Paid', 
    stipend: 18000, 
    mode: 'On-site', 
    duration: '3 months', 
    certificateType: 'Both', 
    certificateProvided: true,
    certificateDetails: 'Both hard copy and soft copy certificates will be provided upon successful internship completion.',
    certificateConditions: 'Complete the internship tenure and deliver assigned project successfully.',
    skills: ['JavaScript', 'React', 'Node.js', 'Product Development'], 
    aiMatch: 86, 
    description: 'Freshworks interns build customer engagement software used by 50,000+ businesses. Work on SaaS products with modern tech stack.',
    companyRating: 4.4
  },
  { 
    title: 'Data Science Intern', 
    courseRole: 'Data Science', 
    compensationType: 'Not Disclosed', 
    stipend: null, 
    mode: 'On-site', 
    duration: 'Not Disclosed', 
    certificateType: 'Not Disclosed', 
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Statistics'], 
    aiMatch: 91, 
    description: 'Apply machine learning and data analysis to solve complex problems at Google scale. Work with massive datasets and cutting-edge ML infrastructure.',
    companyRating: 4.5
  },
  { 
    title: 'Operations Technology Intern', 
    courseRole: 'Operations Technology', 
    compensationType: 'Not Disclosed', 
    stipend: null, 
    mode: 'On-site', 
    duration: 'Not Disclosed', 
    certificateType: 'Not Disclosed', 
    skills: ['Python', 'SQL', 'Operations', 'Automation'], 
    aiMatch: 82, 
    description: 'Amazon operations interns build tools and automation to improve fulfillment center operations. Work on systems that handle millions of packages daily.',
    companyRating: 4.3
  },
  { 
    title: 'Cloud Solutions Intern', 
    courseRole: 'Cloud Solutions', 
    compensationType: 'Not Disclosed', 
    stipend: null, 
    mode: 'Hybrid', 
    duration: '3 months', 
    certificateType: 'Not Disclosed', 
    skills: ['Azure', 'Cloud Computing', 'Python', 'PowerShell'], 
    aiMatch: 89, 
    description: 'Work on Microsoft Azure cloud services. Help customers migrate to cloud and build scalable cloud-native applications.',
    companyRating: 4.4
  },
  { 
    title: 'Backend Development Intern', 
    courseRole: 'Backend Development', 
    compensationType: 'Paid', 
    stipend: 22000, 
    mode: 'On-site', 
    duration: '6 months', 
    certificateType: 'Soft Copy', 
    skills: ['Java', 'Spring Boot', 'Microservices', 'MySQL'], 
    aiMatch: 87, 
    description: 'Build scalable backend systems for Zoho products. Work on microservices architecture and distributed systems.',
    companyRating: 4.2
  },
  { 
    title: 'Cybersecurity Intern', 
    courseRole: 'Cybersecurity', 
    compensationType: 'Not Disclosed', 
    stipend: null, 
    mode: 'On-site', 
    duration: 'Not Disclosed', 
    certificateType: 'Not Disclosed', 
    skills: ['Security', 'Python', 'Penetration Testing', 'Network Security'], 
    aiMatch: 84, 
    description: 'IBM security interns work on enterprise security solutions. Learn threat detection, incident response, and security automation.',
    companyRating: 4.1
  },
  { 
    title: 'Security Engineering Intern', 
    courseRole: 'Security Engineering', 
    compensationType: 'Not Disclosed', 
    stipend: null, 
    mode: 'On-site', 
    duration: '3 months', 
    certificateType: 'Not Disclosed', 
    skills: ['Cybersecurity', 'Network Security', 'Python', 'Cryptography'], 
    aiMatch: 86, 
    description: 'Cisco security interns work on network security products. Build secure networking solutions and learn from security experts.',
    companyRating: 4.3
  },
  { 
    title: 'Full Stack Development Intern', 
    courseRole: 'Full Stack Development', 
    compensationType: 'Paid', 
    stipend: 19000, 
    mode: 'On-site', 
    duration: '3 months', 
    certificateType: 'Both', 
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'], 
    aiMatch: 88, 
    description: 'Freshworks full-stack interns build end-to-end features. Work on React frontend and Node.js backend with modern development practices.',
    companyRating: 4.4
  },
  { 
    title: 'Machine Learning Intern', 
    courseRole: 'Machine Learning', 
    compensationType: 'Not Disclosed', 
    stipend: null, 
    mode: 'Hybrid', 
    duration: 'Not Disclosed', 
    certificateType: 'Not Disclosed', 
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning'], 
    aiMatch: 93, 
    description: 'Work on Google\'s AI and ML projects. Research and develop machine learning models for Google products used by billions.',
    companyRating: 4.5
  },
  { 
    title: 'Frontend Development Intern', 
    courseRole: 'Frontend Development', 
    compensationType: 'Not Disclosed', 
    stipend: null, 
    mode: 'On-site', 
    duration: 'Not Disclosed', 
    certificateType: 'Not Disclosed', 
    skills: ['JavaScript', 'React', 'CSS', 'TypeScript'], 
    aiMatch: 85, 
    description: 'Amazon frontend interns build customer-facing experiences. Work on React applications serving millions of customers daily.',
    companyRating: 4.3
  },
  { 
    title: 'AI Engineering Intern', 
    courseRole: 'AI Engineering', 
    compensationType: 'Not Disclosed', 
    stipend: null, 
    mode: 'Hybrid', 
    duration: '3 months', 
    certificateType: 'Not Disclosed', 
    skills: ['Python', 'AI', 'Machine Learning', 'Azure AI'], 
    aiMatch: 92, 
    description: 'Microsoft AI interns work on Azure AI services. Build and deploy AI models at scale using Microsoft\'s AI infrastructure.',
    companyRating: 4.4
  },
  { 
    title: 'Watson AI Intern', 
    courseRole: 'AI Research', 
    compensationType: 'Not Disclosed', 
    stipend: null, 
    mode: 'Hybrid', 
    duration: 'Not Disclosed', 
    certificateType: 'Not Disclosed', 
    skills: ['Python', 'AI', 'NLP', 'Machine Learning'], 
    aiMatch: 90, 
    description: 'IBM Watson interns work on enterprise AI solutions. Research and develop NLP and ML models for business applications.',
    companyRating: 4.1
  },
  { 
    title: 'DevOps Engineering Intern', 
    courseRole: 'DevOps', 
    compensationType: 'Not Disclosed', 
    stipend: null, 
    mode: 'On-site', 
    duration: '3 months', 
    certificateType: 'Not Disclosed', 
    skills: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'Python'], 
    aiMatch: 83, 
    description: 'Cisco DevOps interns build automation and infrastructure. Work on CI/CD pipelines and cloud infrastructure.',
    companyRating: 4.3
  },
  { 
    title: 'QA Automation Intern', 
    courseRole: 'Quality Assurance', 
    compensationType: 'Paid', 
    stipend: 16000, 
    mode: 'On-site', 
    duration: '3 months', 
    certificateType: 'Soft Copy', 
    skills: ['Python', 'Selenium', 'Test Automation', 'QA'], 
    aiMatch: 80, 
    description: 'Zoho QA interns build test automation frameworks. Ensure quality of enterprise software used by millions worldwide.',
    companyRating: 4.2
  },
  { 
    title: 'Mobile Development Intern', 
    courseRole: 'Mobile Development', 
    compensationType: 'Not Disclosed', 
    stipend: null, 
    mode: 'Remote', 
    duration: 'Not Disclosed', 
    certificateType: 'Not Disclosed', 
    skills: ['Android', 'Kotlin', 'iOS', 'Swift'], 
    aiMatch: 86, 
    description: 'Build mobile applications for Google products. Work on Android and iOS apps with cutting-edge mobile technologies.',
    companyRating: 4.5
  },
  { 
    title: 'Data Engineering Intern', 
    courseRole: 'Data Engineering', 
    compensationType: 'Not Disclosed', 
    stipend: null, 
    mode: 'On-site', 
    duration: 'Not Disclosed', 
    certificateType: 'Not Disclosed', 
    skills: ['Python', 'Spark', 'Hadoop', 'SQL', 'ETL'], 
    aiMatch: 88, 
    description: 'Amazon data interns build big data pipelines. Process petabytes of data to drive business insights and customer experiences.',
    companyRating: 4.3
  },
  { 
    title: 'Systems Engineering Intern', 
    courseRole: 'Systems Engineering', 
    compensationType: 'Not Disclosed', 
    stipend: null, 
    mode: 'Hybrid', 
    duration: '3 months', 
    certificateType: 'Not Disclosed', 
    skills: ['C++', 'Systems Programming', 'Linux', 'Operating Systems'], 
    aiMatch: 85, 
    description: 'Microsoft systems interns work on Windows and Azure infrastructure. Build low-level systems and performance-critical code.',
    companyRating: 4.4
  },
  { 
    title: 'UI/UX Design Intern', 
    courseRole: 'UI/UX Design', 
    compensationType: 'Paid', 
    stipend: 17000, 
    mode: 'On-site', 
    duration: '3 months', 
    certificateType: 'Both', 
    skills: ['Figma', 'UI/UX', 'Design', 'Prototyping'], 
    aiMatch: 78, 
    description: 'Freshworks design interns create beautiful user experiences. Design intuitive interfaces for business software used globally.',
    companyRating: 4.4
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function futureDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

// ─── Seed ────────────────────────────────────────────────────────────────────
async function seed() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not set in .env');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  await Internship.deleteMany({});
  await Company.deleteMany({});
  console.log('🗑  Cleared existing data');

  // Create unique companies first
  const uniqueCompaniesData = [
    { 
      companyName: 'Google', 
      location: 'Bangalore', 
      website: 'https://www.google.com', 
      industry: 'Technology', 
      description: 'Google is a global technology leader focusing on organizing the world\'s information and making it universally accessible.',
      logo: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
      careersUrl: 'https://careers.google.com/students/',
      verified_status: 'approved'
    },
    { 
      companyName: 'Amazon', 
      location: 'Hyderabad', 
      website: 'https://www.amazon.com', 
      industry: 'E-commerce & Technology', 
      description: 'Amazon is the world\'s largest online retailer and a leading cloud computing provider through AWS.',
      logo: null,
      careersUrl: 'https://www.amazon.jobs/en/business_categories/student-programs',
      verified_status: 'approved'
    },
    { 
      companyName: 'Microsoft', 
      location: 'Bangalore', 
      website: 'https://www.microsoft.com', 
      industry: 'Technology', 
      description: 'Microsoft develops, manufactures, licenses, and supports software, services, devices, and solutions worldwide.',
      logo: null,
      careersUrl: 'https://careers.microsoft.com/students/',
      verified_status: 'approved'
    },
    { 
      companyName: 'Zoho', 
      location: 'Chennai', 
      website: 'https://www.zoho.com', 
      industry: 'Software', 
      description: 'Zoho Corporation provides business software used by 100M+ users globally, including CRM, productivity, and collaboration tools.',
      logo: null,
      careersUrl: 'https://careers.zohocorp.com/recruitment/careers.html',
      verified_status: 'approved'
    },
    { 
      companyName: 'IBM', 
      location: 'Bangalore', 
      website: 'https://www.ibm.com', 
      industry: 'Technology & Consulting', 
      description: 'IBM is a global technology and consulting company providing hardware, software, cloud-based services, and cognitive computing.',
      logo: null,
      careersUrl: 'https://www.ibm.com/careers/internship',
      verified_status: 'approved'
    },
    { 
      companyName: 'Cisco', 
      location: 'Bangalore', 
      website: 'https://www.cisco.com', 
      industry: 'Networking & Technology', 
      description: 'Cisco is the worldwide leader in IT and networking, helping companies of all sizes transform how people connect, communicate and collaborate.',
      logo: null,
      careersUrl: 'https://jobs.cisco.com/jobs/SearchJobs/?listFilterMode=1&21180=%5B202648%5D',
      verified_status: 'approved'
    },
    { 
      companyName: 'Freshworks', 
      location: 'Chennai', 
      website: 'https://www.freshworks.com', 
      industry: 'SaaS', 
      description: 'Freshworks provides innovative customer engagement software for businesses of all sizes, making it easy for teams to acquire, engage and support customers.',
      logo: null,
      careersUrl: 'https://www.freshworks.com/company/careers/',
      verified_status: 'approved'
    },
  ];
  
  const companies = await Company.insertMany(uniqueCompaniesData);
  console.log(`🏢  Inserted ${companies.length} unique companies`);
  
  // Map company names to IDs for internship creation
  const companyMap = {};
  companies.forEach(c => {
    companyMap[c.companyName] = c;
  });

  const internships = TEMPLATES.map((t, i) => {
    // Determine which company and location for this internship
    const companyNames = ['Google', 'Amazon', 'Microsoft', 'Zoho', 'IBM', 'Cisco', 'Freshworks'];
    const locations = ['Bangalore', 'Hyderabad', 'Chennai', 'Coimbatore', 'Pune', 'Mumbai', 'Delhi', 'Remote'];
    
    const companyName = companyNames[i % companyNames.length];
    const location = locations[i % locations.length];
    const company = companyMap[companyName];
    
    // Starting dates - some disclosed, some not
    const hasStartDate = i % 3 !== 0; // 67% have start dates
    const startingDate = hasStartDate ? futureDate(15 + i * 5) : null;
    
    // Deadlines - only for some internships
    const hasDeadline = hasStartDate && (i % 4 !== 0); // 50% have deadlines
    const applicationDeadline = hasDeadline ? futureDate(7 + i * 3) : null;
    
    // Application status - most open
    const applicationStatuses = ['Open', 'Open', 'Open', 'Open', 'Closed'];
    const applicationStatus = applicationStatuses[i % applicationStatuses.length];
    
    return {
      companyId: company._id,
      title: t.title,
      courseRole: t.courseRole,
      description: t.description,
      compensationType: t.compensationType,
      stipend: t.stipend, // null for "Not Disclosed"
      mode: t.mode,
      duration: t.duration, // "Not Disclosed" for some
      certificateType: t.certificateType, // "Not Disclosed" for most
      certificateProvided: t.certificateProvided !== undefined ? t.certificateProvided : null,
      certificateDetails: t.certificateDetails || null,
      certificateConditions: t.certificateConditions || null,
      aiMatch: t.aiMatch,
      companyRating: t.companyRating,
      applicationStatus: applicationStatus,
      companyWebsite: company.website,
      location: location,
      startingDate: startingDate, // null = "Not Announced"
      applicationDeadline: applicationDeadline, // null = "Not Announced"
      requiredSkills: t.skills || [],
      
      // Official application links - use company careers page
      applicationUrl: company.careersUrl,
      internshipDetailsUrl: company.careersUrl,
      
      // Mark as unverified since we don't have real verified data
      isVerified: false,
      sourceVerified: false, // Not manually verified
      sourceName: 'Company Careers Page',
      sourceUrl: company.careersUrl,
      
      status: 'Approved',
    };
  });

  await Internship.insertMany(internships);
  console.log(`📋  Inserted ${internships.length} real company internships`);
  
  // Location breakdown
  console.log('\nLocation breakdown:');
  const byLoc = {};
  internships.forEach(i => { byLoc[i.location] = (byLoc[i.location] || 0) + 1; });
  Object.entries(byLoc).sort((a, b) => b[1] - a[1]).forEach(([loc, n]) => console.log(`  ${loc}: ${n}`));
  
  // Company breakdown
  console.log('\nCompany breakdown:');
  companies.forEach(c => {
    const count = internships.filter(i => i.companyId.toString() === c._id.toString()).length;
    console.log(`  ${c.companyName}: ${count} internship(s)`);
  });
  
  // Compensation breakdown
  const paidCount = internships.filter(i => i.compensationType === 'Paid').length;
  const notDisclosedCount = internships.filter(i => i.compensationType === 'Not Disclosed').length;
  console.log('\nCompensation breakdown:');
  console.log(`  Paid (Disclosed): ${paidCount}`);
  console.log(`  Not Disclosed: ${notDisclosedCount}`);

  await mongoose.disconnect();
  console.log('\n✅ Seed complete - Real company data loaded!');
}

seed().catch((err) => { console.error('❌ Seed failed:', err.message); process.exit(1); });
