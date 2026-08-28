/**
 * Seed internships for all companies in locations data
 * This creates sample internship postings for all companies across different locations
 */

import dotenv from 'dotenv';
dotenv.config();

import { Internship, Company } from '../models/index.js';
import sequelize from '../config/database.js';

// Company career links data matching frontend
const LOCATION_CAREER_LINKS = {
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

const internshipRoles = [
  'Software Development Intern',
  'Data Science Intern',
  'Full Stack Developer Intern',
  'Machine Learning Intern',
  'Frontend Developer Intern',
  'Backend Developer Intern',
  'DevOps Intern',
  'Business Analyst Intern',
  'Product Management Intern',
  'UI/UX Design Intern',
];

const skills = {
  'Software Development Intern': ['JavaScript', 'Python', 'Java', 'Git'],
  'Data Science Intern': ['Python', 'SQL', 'Machine Learning', 'Statistics'],
  'Full Stack Developer Intern': ['React', 'Node.js', 'MongoDB', 'Express'],
  'Machine Learning Intern': ['Python', 'TensorFlow', 'PyTorch', 'Statistics'],
  'Frontend Developer Intern': ['React', 'JavaScript', 'HTML', 'CSS'],
  'Backend Developer Intern': ['Node.js', 'Python', 'PostgreSQL', 'APIs'],
  'DevOps Intern': ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
  'Business Analyst Intern': ['Excel', 'SQL', 'Data Analysis', 'Communication'],
  'Product Management Intern': ['Product Strategy', 'User Research', 'Agile'],
  'UI/UX Design Intern': ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
};

async function seedCompanyInternships() {
  try {
    console.log('🌱 Starting company internships seeding...\n');

    // Get all unique companies across all locations
    const allCompanies = new Set();
    const companyLocationMap = {};

    Object.entries(LOCATION_CAREER_LINKS).forEach(([location, companies]) => {
      companies.forEach(({ company, url }) => {
        allCompanies.add(company);
        if (!companyLocationMap[company]) {
          companyLocationMap[company] = [];
        }
        companyLocationMap[company].push({ location, url });
      });
    });

    console.log(`Found ${allCompanies.size} unique companies across all locations\n`);

    let companiesCreated = 0;
    let internshipsCreated = 0;

    // Create companies and internships
    for (const companyName of allCompanies) {
      const locations = companyLocationMap[companyName];
      
      // Check if company exists
      let company = await Company.findOne({ where: { companyName } });
      
      if (!company) {
        // Create company
        company = await Company.create({
          companyName,
          description: `${companyName} is a leading technology company offering innovative solutions and career opportunities for students and professionals.`,
          website: locations[0].url.split('/careers')[0] || locations[0].url,
          industry: 'Technology',
          location: locations[0].location,
          careersUrl: locations[0].url,
          logo: `https://logo.clearbit.com/${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
          verified_status: 'approved',
        });
        companiesCreated++;
        console.log(`✅ Created company: ${companyName}`);
      }

      // Create internships for each location this company operates in
      for (const { location, url } of locations) {
        // Create 1-2 random internship roles per company per location
        const numRoles = Math.floor(Math.random() * 2) + 1;
        const selectedRoles = [];
        
        for (let i = 0; i < numRoles; i++) {
          const role = internshipRoles[Math.floor(Math.random() * internshipRoles.length)];
          if (!selectedRoles.includes(role)) {
            selectedRoles.push(role);
          }
        }

        for (const role of selectedRoles) {
          const isPaid = Math.random() > 0.3; // 70% paid
          const stipend = isPaid ? Math.floor(Math.random() * 20000) + 10000 : 0;
          
          const startDate = new Date();
          startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 60)); // Random start within 60 days
          
          const deadline = new Date(startDate);
          deadline.setDate(deadline.getDate() - Math.floor(Math.random() * 14) - 7); // Deadline 1-3 weeks before start

          const internship = await Internship.create({
            companyId: company.id,
            title: role,
            description: `Join ${companyName} as a ${role} and gain hands-on experience working on real-world projects.`,
            courseRole: role,
            location: location,
            duration: `${Math.floor(Math.random() * 3) + 3} months`,
            mode: ['Remote', 'On-site', 'Hybrid'][Math.floor(Math.random() * 3)],
            compensationType: isPaid ? 'Paid' : 'Unpaid',
            stipend: stipend,
            certificateType: ['Hard Copy', 'Soft Copy', 'Both', 'Not Disclosed'][Math.floor(Math.random() * 4)],
            requiredSkills: skills[role] || ['Programming', 'Problem Solving'],
            startingDate: startDate,
            applicationDeadline: deadline,
            applicationUrl: url,
            status: 'Approved',
            applicationStatus: 'Open',
          });

          internshipsCreated++;
        }
      }
    }

    console.log(`\n✅ Seeding completed successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   - Companies created: ${companiesCreated}`);
    console.log(`   - Internships created: ${internshipsCreated}`);
    console.log(`   - Total companies: ${allCompanies.size}`);

  } catch (error) {
    console.error('❌ Error seeding company internships:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run seeding
seedCompanyInternships();
