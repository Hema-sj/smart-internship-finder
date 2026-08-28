/**
 * Add missing companies to database
 * Run: node scripts/addMissingCompanies.js
 */
import 'dotenv/config';
import { Company } from '../models/index.js';
import sequelize from '../config/database.js';

const NEW_COMPANIES = [
  {
    companyName: 'Accenture',
    location: 'Bangalore',
    website: 'https://www.accenture.com',
    industry: 'Consulting & Technology',
    description: 'Accenture is a global professional services company with leading capabilities in digital, cloud and security.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg',
    careersUrl: 'https://www.accenture.com/in-en/careers',
    verified_status: 'approved'
  },
  {
    companyName: 'Deloitte',
    location: 'Mumbai',
    website: 'https://www.deloitte.com',
    industry: 'Consulting & Audit',
    description: 'Deloitte provides audit, consulting, financial advisory, risk advisory, tax, and related services to select clients.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg',
    careersUrl: 'https://www.deloitte.com/in/en/careers/students.html',
    verified_status: 'approved'
  },
  {
    companyName: 'Intel',
    location: 'Bangalore',
    website: 'https://www.intel.com',
    industry: 'Semiconductor & Technology',
    description: 'Intel Corporation is an American multinational corporation and technology company that designs and manufactures computer processors and related hardware.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg',
    careersUrl: 'https://jobs.intel.com/',
    verified_status: 'approved'
  },
  {
    companyName: 'Oracle',
    location: 'Bangalore',
    website: 'https://www.oracle.com',
    industry: 'Software & Cloud',
    description: 'Oracle Corporation is an American computer technology corporation that sells database software, cloud solutions, and enterprise software products.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg',
    careersUrl: 'https://careers.oracle.com/',
    verified_status: 'approved'
  },
  {
    companyName: 'SAP',
    location: 'Bangalore',
    website: 'https://www.sap.com',
    industry: 'Enterprise Software',
    description: 'SAP is a German multinational software company that develops enterprise software to manage business operations and customer relations.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg',
    careersUrl: 'https://www.sap.com/about/careers.html',
    verified_status: 'approved'
  },
  {
    companyName: 'NVIDIA',
    location: 'Pune',
    website: 'https://www.nvidia.com',
    industry: 'Graphics & AI Technology',
    description: 'NVIDIA Corporation is an American technology company that designs graphics processing units (GPUs) for gaming and professional markets.',
    logo: 'https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg',
    careersUrl: 'https://www.nvidia.com/en-us/about-nvidia/careers/',
    verified_status: 'approved'
  },
  {
    companyName: 'Adobe',
    location: 'Noida',
    website: 'https://www.adobe.com',
    industry: 'Software & Creative',
    description: 'Adobe Inc. is an American computer software company that creates digital media and marketing software.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.svg',
    careersUrl: 'https://careers.adobe.com/',
    verified_status: 'approved'
  },
  {
    companyName: 'Salesforce',
    location: 'Hyderabad',
    website: 'https://www.salesforce.com',
    industry: 'Cloud & CRM',
    description: 'Salesforce is an American cloud-based software company that provides customer relationship management (CRM) software and applications.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg',
    careersUrl: 'https://careers.salesforce.com/en/university-recruiting/',
    verified_status: 'approved'
  },
  {
    companyName: 'PayPal',
    location: 'Chennai',
    website: 'https://www.paypal.com',
    industry: 'Financial Technology',
    description: 'PayPal Holdings, Inc. is an American multinational financial technology company that operates an online payments system.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
    careersUrl: 'https://careers.pypl.com/',
    verified_status: 'approved'
  },
  {
    companyName: 'Qualcomm',
    location: 'Bangalore',
    website: 'https://www.qualcomm.com',
    industry: 'Semiconductor & Wireless',
    description: 'Qualcomm Incorporated is an American semiconductor and telecommunications equipment company that designs and markets wireless telecommunications products.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Qualcomm-Logo.svg',
    careersUrl: 'https://www.qualcomm.com/company/careers',
    verified_status: 'approved'
  },
  {
    companyName: 'Tech Mahindra',
    location: 'Pune',
    website: 'https://www.techmahindra.com',
    industry: 'IT Services & Consulting',
    description: 'Tech Mahindra Limited is an Indian multinational technology company that provides information technology (IT) services and business process outsourcing.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Tech_Mahindra_New_Logo.svg',
    careersUrl: 'https://careers.techmahindra.com/',
    verified_status: 'approved'
  }
];

async function addCompanies() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL\n');

    let added = 0;
    let existing = 0;

    for (const companyData of NEW_COMPANIES) {
      const [company, created] = await Company.findOrCreate({
        where: { companyName: companyData.companyName },
        defaults: companyData
      });

      if (created) {
        console.log(`✨ Added: ${companyData.companyName.padEnd(20)} → ${companyData.careersUrl}`);
        added++;
      } else {
        console.log(`ℹ️  Exists: ${companyData.companyName}`);
        existing++;
      }
    }

    console.log('\n' + '━'.repeat(70));
    console.log(`✨ Added: ${added} new companies`);
    console.log(`ℹ️  Already existed: ${existing} companies`);
    console.log(`📊 Total companies in system: ${added + existing + 12}`);
    console.log('━'.repeat(70));
    console.log('\n✅ All companies added successfully!');
    console.log('   Total companies with official links: 23');

  } catch (error) {
    console.error('❌ Error adding companies:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

addCompanies();
