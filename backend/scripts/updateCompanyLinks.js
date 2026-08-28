/**
 * Update company career/application links with official URLs
 * Run: node scripts/updateCompanyLinks.js
 */
import 'dotenv/config';
import { Company, Internship } from '../models/index.js';
import sequelize from '../config/database.js';

const OFFICIAL_COMPANY_LINKS = {
  'Google': 'https://www.google.com/about/careers/applications/',
  'Microsoft': 'https://careers.microsoft.com/v2/global/en/students',
  'Amazon': 'https://www.amazon.jobs/content/en/career-programs/university/internships-for-students',
  'IBM': 'https://www.ibm.com/in-en/careers/internships',
  'TCS': 'https://www.tcs.com/careers/india/internship',
  'Infosys': 'https://www.infosys.com/careers/apply/students.html',
  'Accenture': 'https://www.accenture.com/in-en/careers',
  'Zoho': 'https://www.zoho.com/careers/',
  'Wipro': 'https://careers.wipro.com/',
  'Deloitte': 'https://www.deloitte.com/in/en/careers/students.html',
  'Intel': 'https://jobs.intel.com/',
  'Cisco': 'https://jobs.cisco.com/',
  'Oracle': 'https://careers.oracle.com/',
  'SAP': 'https://www.sap.com/about/careers.html',
  'NVIDIA': 'https://www.nvidia.com/en-us/about-nvidia/careers/',
  'Adobe': 'https://careers.adobe.com/',
  'Salesforce': 'https://careers.salesforce.com/en/university-recruiting/',
  'PayPal': 'https://careers.pypl.com/',
  'Qualcomm': 'https://www.qualcomm.com/company/careers',
  'Tech Mahindra': 'https://careers.techmahindra.com/',
  'HCL Technologies': 'https://www.hcltech.com/careers',
  'Cognizant': 'https://careers.cognizant.com/',
  'Freshworks': 'https://www.freshworks.com/company/careers/',
};

async function updateCompanyLinks() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL\n');

    let updated = 0;
    let notFound = 0;

    for (const [companyName, careersUrl] of Object.entries(OFFICIAL_COMPANY_LINKS)) {
      // Update company
      const [updateCount] = await Company.update(
        { careersUrl },
        { where: { companyName } }
      );

      if (updateCount > 0) {
        console.log(`✅ ${companyName.padEnd(20)} → ${careersUrl}`);
        
        // Also update internships for this company
        const company = await Company.findOne({ where: { companyName } });
        if (company) {
          await Internship.update(
            { 
              applicationUrl: careersUrl,
              sourceUrl: careersUrl,
              sourceName: `${companyName} Careers Portal`
            },
            { where: { companyId: company.id } }
          );
        }
        
        updated++;
      } else {
        console.log(`⚠️  ${companyName.padEnd(20)} → Not found in database`);
        notFound++;
      }
    }

    console.log('\n' + '━'.repeat(70));
    console.log(`✅ Updated: ${updated} companies`);
    console.log(`⚠️  Not found: ${notFound} companies`);
    console.log('━'.repeat(70));
    console.log('\n✅ Company links updated successfully!');
    console.log('   When users click "Apply Now", they will be directed to official company career pages.');

  } catch (error) {
    console.error('❌ Error updating company links:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

updateCompanyLinks();
