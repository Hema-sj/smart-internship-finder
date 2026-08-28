/**
 * Seed Chennai Companies and Internships to PostgreSQL
 * Run: node backend/scripts/seedChennaiInternships.js
 */
import 'dotenv/config';
import sequelize from '../config/database.js';
import { Company, Internship } from '../models/index.js';

const chennaiCompanies = [
  { 
    companyName: 'TCS', 
    location: 'Chennai', 
    website: 'https://www.tcs.com', 
    industry: 'IT Services & Consulting', 
    description: 'Tata Consultancy Services (TCS) is an IT services, consulting and business solutions organization that delivers real results to global businesses.',
    careersUrl: 'https://www.tcs.com/careers/freshers',
    verified_status: 'approved',
    rating: 4.0,
    reviewCount: 0
  },
  { 
    companyName: 'Infosys', 
    location: 'Chennai', 
    website: 'https://www.infosys.com', 
    industry: 'IT Services & Consulting', 
    description: 'Infosys is a global leader in next-generation digital services and consulting. We enable clients in more than 50 countries to navigate their digital transformation.',
    careersUrl: 'https://www.infosys.com/careers/students.html',
    verified_status: 'approved',
    rating: 4.1,
    reviewCount: 0
  },
  { 
    companyName: 'Wipro', 
    location: 'Chennai', 
    website: 'https://www.wipro.com', 
    industry: 'IT Services & Consulting', 
    description: 'Wipro Limited is a leading technology services and consulting company focused on building innovative solutions that address clients\' most complex digital transformation needs.',
    careersUrl: 'https://careers.wipro.com/careers-home/jobs?domain=Students',
    verified_status: 'approved',
    rating: 3.9,
    reviewCount: 0
  },
  { 
    companyName: 'HCL Technologies', 
    location: 'Chennai', 
    website: 'https://www.hcltech.com', 
    industry: 'IT Services', 
    description: 'HCL Technologies is a next-generation global technology company that helps enterprises reimagine their businesses for the digital age.',
    careersUrl: 'https://www.hcltech.com/careers/freshers',
    verified_status: 'approved',
    rating: 3.8,
    reviewCount: 0
  },
  { 
    companyName: 'Cognizant', 
    location: 'Chennai', 
    website: 'https://www.cognizant.com', 
    industry: 'IT Services & Consulting', 
    description: 'Cognizant is one of the world\'s leading professional services companies, transforming clients\' business, operating and technology models for the digital era.',
    careersUrl: 'https://careers.cognizant.com/in/en/students',
    verified_status: 'approved',
    rating: 4.2,
    reviewCount: 0
  }
];

const chennaiInternships = [
  {
    title: 'Full Stack Developer Intern',
    courseRole: 'Full Stack Development',
    compensationType: 'Paid',
    stipend: 15000,
    mode: 'On-site',
    location: 'Chennai',
    duration: '6 months',
    startingDate: new Date('2024-07-01'),
    applicationDeadline: new Date('2024-06-15'),
    certificateType: 'Both',
    certificateProvided: true,
    certificateDetails: 'Certificate of internship completion with performance evaluation.',
    certificateConditions: 'Complete minimum 6 months with satisfactory performance.',
    requiredSkills: ['Java', 'Spring Boot', 'React', 'MySQL', 'REST API'],
    description: 'TCS Chennai offers full stack development internships on enterprise applications. Work with Fortune 500 clients on digital transformation projects.',
    status: 'Approved',
    applicationStatus: 'Open',
    companyName: 'TCS'
  },
  {
    title: 'Software Engineer Intern',
    courseRole: 'Software Engineering',
    compensationType: 'Paid',
    stipend: 18000,
    mode: 'On-site',
    location: 'Chennai',
    duration: '6 months',
    startingDate: new Date('2024-07-15'),
    applicationDeadline: new Date('2024-06-30'),
    certificateType: 'Soft Copy',
    certificateProvided: true,
    certificateDetails: 'Digital certificate upon successful completion of training and project.',
    certificateConditions: 'Complete training modules and deliver assigned project.',
    requiredSkills: ['Java', 'Python', 'SQL', 'Data Structures', 'Algorithms'],
    description: 'Infosys Chennai campus internship program. Get trained by industry experts and work on live client projects in domains like Banking, Healthcare, and Retail.',
    status: 'Approved',
    applicationStatus: 'Open',
    companyName: 'Infosys'
  },
  {
    title: 'Project Engineer Intern',
    courseRole: 'Project Engineering',
    compensationType: 'Paid',
    stipend: 12000,
    mode: 'On-site',
    location: 'Chennai',
    duration: '3 months',
    startingDate: new Date('2024-06-01'),
    applicationDeadline: new Date('2024-05-20'),
    certificateType: 'Soft Copy',
    certificateProvided: true,
    certificateDetails: 'Internship completion certificate.',
    certificateConditions: 'Regular attendance and project submission.',
    requiredSkills: ['C', 'C++', 'Python', 'Linux', 'Problem Solving'],
    description: 'Wipro Chennai internship for engineering students. Work on embedded systems, IoT solutions, and enterprise software development.',
    status: 'Approved',
    applicationStatus: 'Open',
    companyName: 'Wipro'
  },
  {
    title: 'Technical Support Intern',
    courseRole: 'Technical Support',
    compensationType: 'Paid',
    stipend: 10000,
    mode: 'On-site',
    location: 'Chennai',
    duration: '3 months',
    startingDate: new Date('2024-06-15'),
    applicationDeadline: new Date('2024-06-01'),
    certificateType: 'Soft Copy',
    certificateProvided: true,
    requiredSkills: ['Networking', 'Windows', 'Linux', 'Troubleshooting', 'Customer Service'],
    description: 'HCL Technologies Chennai offers technical support internships. Learn IT infrastructure management and customer support for global clients.',
    status: 'Approved',
    applicationStatus: 'Open',
    companyName: 'HCL Technologies'
  },
  {
    title: 'Business Analyst Intern',
    courseRole: 'Business Analysis',
    compensationType: 'Paid',
    stipend: 15000,
    mode: 'Hybrid',
    location: 'Chennai',
    duration: '6 months',
    startingDate: new Date('2024-07-01'),
    applicationDeadline: new Date('2024-06-20'),
    certificateType: 'Both',
    certificateProvided: true,
    certificateDetails: 'Internship certificate with skill assessment report.',
    certificateConditions: 'Complete 6-month tenure and pass final assessment.',
    requiredSkills: ['SQL', 'Excel', 'Data Analysis', 'Business Intelligence', 'Communication'],
    description: 'Cognizant Chennai business analyst internship. Work with clients across industries to analyze business processes and deliver digital solutions.',
    status: 'Approved',
    applicationStatus: 'Open',
    companyName: 'Cognizant'
  },
  {
    title: 'Cloud Infrastructure Intern',
    courseRole: 'Cloud Infrastructure',
    compensationType: 'Paid',
    stipend: 20000,
    mode: 'On-site',
    location: 'Chennai',
    duration: '6 months',
    startingDate: new Date('2024-08-01'),
    applicationDeadline: new Date('2024-07-15'),
    certificateType: 'Soft Copy',
    certificateProvided: true,
    requiredSkills: ['AWS', 'Azure', 'Linux', 'Networking', 'Python'],
    description: 'Wipro Chennai cloud infrastructure internship. Build and manage cloud environments for enterprise clients across AWS and Azure platforms.',
    status: 'Approved',
    applicationStatus: 'Open',
    companyName: 'Wipro'
  },
  {
    title: 'Database Administrator Intern',
    courseRole: 'Database Administration',
    compensationType: 'Paid',
    stipend: 14000,
    mode: 'On-site',
    location: 'Chennai',
    duration: '4 months',
    startingDate: new Date('2024-06-10'),
    applicationDeadline: new Date('2024-05-25'),
    certificateType: 'Soft Copy',
    certificateProvided: true,
    requiredSkills: ['SQL', 'MySQL', 'PostgreSQL', 'Oracle', 'Database Design'],
    description: 'TCS Chennai DBA internship. Learn database administration, performance tuning, backup and recovery for enterprise databases.',
    status: 'Approved',
    applicationStatus: 'Open',
    companyName: 'TCS'
  },
  {
    title: 'AI/ML Intern',
    courseRole: 'Artificial Intelligence',
    compensationType: 'Paid',
    stipend: 25000,
    mode: 'On-site',
    location: 'Chennai',
    duration: '6 months',
    startingDate: new Date('2024-07-20'),
    applicationDeadline: new Date('2024-07-05'),
    certificateType: 'Both',
    certificateProvided: true,
    certificateDetails: 'Certificate with project completion letter from project mentor.',
    certificateConditions: 'Deliver ML model with minimum 85% accuracy.',
    requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'Deep Learning', 'NLP'],
    description: 'Infosys Chennai AI/ML internship. Work on cutting-edge AI solutions including computer vision, NLP, and predictive analytics for enterprise clients.',
    status: 'Approved',
    applicationStatus: 'Open',
    companyName: 'Infosys'
  }
];

async function seedChennaiData() {
  try {
    console.log('🚀 Starting Chennai Companies & Internships Seed...\n');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL\n');
    
    // Seed companies
    console.log('📦 Seeding Chennai companies...');
    const createdCompanies = [];
    
    for (const companyData of chennaiCompanies) {
      const [company, created] = await Company.findOrCreate({
        where: { companyName: companyData.companyName, location: companyData.location },
        defaults: companyData
      });
      
      if (created) {
        console.log(`  ✓ Created ${companyData.companyName}`);
      } else {
        console.log(`  → ${companyData.companyName} already exists`);
      }
      createdCompanies.push(company);
    }
    
    console.log(`\n✅ Companies processed: ${chennaiCompanies.length}\n`);
    
    // Create company map
    const companyMap = {};
    createdCompanies.forEach(c => {
      companyMap[c.companyName] = c.id;
    });
    
    // Seed internships
    console.log('📦 Seeding Chennai internships...');
    let createdCount = 0;
    let skippedCount = 0;
    
    for (const internshipData of chennaiInternships) {
      const companyId = companyMap[internshipData.companyName];
      if (!companyId) {
        console.log(`  ⚠ Company not found for: ${internshipData.title}`);
        skippedCount++;
        continue;
      }
      
      // Set applicationUrl from company
      const company = createdCompanies.find(c => c.companyName === internshipData.companyName);
      internshipData.applicationUrl = company.careersUrl;
      internshipData.companyId = companyId;
      
      // Remove companyName field (not in schema)
      delete internshipData.companyName;
      
      const [internship, created] = await Internship.findOrCreate({
        where: { 
          title: internshipData.title,
          companyId: companyId,
          location: 'Chennai'
        },
        defaults: internshipData
      });
      
      if (created) {
        console.log(`  ✓ Created ${internshipData.title}`);
        createdCount++;
      } else {
        console.log(`  → ${internshipData.title} already exists`);
        skippedCount++;
      }
    }
    
    console.log(`\n✅ Internships created: ${createdCount}`);
    console.log(`ℹ️  Internships skipped: ${skippedCount}`);
    
    // Summary
    console.log('\n📊 Seed Summary:');
    console.log(`  Companies: ${chennaiCompanies.length}`);
    console.log(`  Internships: ${createdCount} new, ${skippedCount} existing`);
    console.log(`  Total Chennai internships in DB: ${await Internship.count({ where: { location: 'Chennai' } })}`);
    
    console.log('\n✅ Chennai seed completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

seedChennaiData();
