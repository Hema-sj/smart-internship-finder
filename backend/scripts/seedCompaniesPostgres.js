/**
 * PostgreSQL Seed Script for Companies
 * Updates company logos and information
 */
import 'dotenv/config';
import { Company } from '../models/index.js';
import sequelize from '../config/database.js';

const companiesData = [
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    careersUrl: 'https://www.amazon.jobs/en/business_categories/student-programs',
    verified_status: 'approved'
  },
  { 
    companyName: 'Microsoft', 
    location: 'Bangalore', 
    website: 'https://www.microsoft.com', 
    industry: 'Technology', 
    description: 'Microsoft develops, manufactures, licenses, and supports software, services, devices, and solutions worldwide.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
    careersUrl: 'https://careers.microsoft.com/students/',
    verified_status: 'approved'
  },
  { 
    companyName: 'Zoho', 
    location: 'Chennai', 
    website: 'https://www.zoho.com', 
    industry: 'Software', 
    description: 'Zoho Corporation provides business software used by 100M+ users globally, including CRM, productivity, and collaboration tools.',
    logo: 'https://www.zoho.com/sites/zweb/images/ogimage/zoho-logo.png',
    careersUrl: 'https://careers.zohocorp.com/recruitment/careers.html',
    verified_status: 'approved'
  },
  { 
    companyName: 'IBM', 
    location: 'Bangalore', 
    website: 'https://www.ibm.com', 
    industry: 'Technology & Consulting', 
    description: 'IBM is a global technology and consulting company providing hardware, software, cloud-based services, and cognitive computing.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
    careersUrl: 'https://www.ibm.com/careers/internship',
    verified_status: 'approved'
  },
  { 
    companyName: 'Cisco', 
    location: 'Bangalore', 
    website: 'https://www.cisco.com', 
    industry: 'Networking & Technology', 
    description: 'Cisco is the worldwide leader in IT and networking, helping companies of all sizes transform how people connect, communicate and collaborate.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg',
    careersUrl: 'https://jobs.cisco.com/jobs/SearchJobs/?listFilterMode=1&21180=%5B202648%5D',
    verified_status: 'approved'
  },
  { 
    companyName: 'Freshworks', 
    location: 'Chennai', 
    website: 'https://www.freshworks.com', 
    industry: 'SaaS', 
    description: 'Freshworks provides innovative customer engagement software for businesses of all sizes, making it easy for teams to acquire, engage and support customers.',
    logo: 'https://www.freshworks.com/static-assets/images/common/company/logos/logo-gradient.svg',
    careersUrl: 'https://www.freshworks.com/company/careers/',
    verified_status: 'approved'
  },
  { 
    companyName: 'TCS', 
    location: 'Chennai', 
    website: 'https://www.tcs.com', 
    industry: 'IT Services & Consulting', 
    description: 'Tata Consultancy Services (TCS) is an IT services, consulting and business solutions organization that delivers real results to global businesses.',
    logo: 'https://www.tcs.com/content/dam/global-tcs/en/images/logo/tata-consultancy-services-logo.png',
    careersUrl: 'https://www.tcs.com/careers/freshers',
    verified_status: 'approved'
  },
  { 
    companyName: 'Infosys', 
    location: 'Chennai', 
    website: 'https://www.infosys.com', 
    industry: 'IT Services & Consulting', 
    description: 'Infosys is a global leader in next-generation digital services and consulting. We enable clients in more than 50 countries to navigate their digital transformation.',
    logo: 'https://www.infosys.com/content/dam/infosys-web/en/global-resource/media-resources/infosys-logo-svg.svg',
    careersUrl: 'https://www.infosys.com/careers/students.html',
    verified_status: 'approved'
  },
  { 
    companyName: 'Wipro', 
    location: 'Chennai', 
    website: 'https://www.wipro.com', 
    industry: 'IT Services & Consulting', 
    description: 'Wipro Limited is a leading technology services and consulting company focused on building innovative solutions that address clients\' most complex digital transformation needs.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg',
    careersUrl: 'https://careers.wipro.com/careers-home/jobs?domain=Students',
    verified_status: 'approved'
  },
  { 
    companyName: 'HCL Technologies', 
    location: 'Chennai', 
    website: 'https://www.hcltech.com', 
    industry: 'IT Services', 
    description: 'HCL Technologies is a next-generation global technology company that helps enterprises reimagine their businesses for the digital age.',
    logo: 'https://www.hcltech.com/themes/custom/hcltech/logo.svg',
    careersUrl: 'https://www.hcltech.com/careers/freshers',
    verified_status: 'approved'
  },
  { 
    companyName: 'Cognizant', 
    location: 'Chennai', 
    website: 'https://www.cognizant.com', 
    industry: 'IT Services & Consulting', 
    description: 'Cognizant is one of the world\'s leading professional services companies, transforming clients\' business, operating and technology models for the digital era.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Cognizant_logo_2022.svg',
    careersUrl: 'https://careers.cognizant.com/in/en/students',
    verified_status: 'approved'
  },
];

async function seed() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL');

    let updated = 0;
    let created = 0;

    for (const companyData of companiesData) {
      const [company, wasCreated] = await Company.upsert(companyData, {
        conflictFields: ['companyName']
      });

      if (wasCreated) {
        created++;
        console.log(`✨ Created: ${companyData.companyName}`);
      } else {
        updated++;
        console.log(`🔄 Updated: ${companyData.companyName}`);
      }
    }

    console.log(`\n✅ Seed complete!`);
    console.log(`   Created: ${created} companies`);
    console.log(`   Updated: ${updated} companies`);
    console.log(`   Total: ${companiesData.length} companies`);

  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seed();
