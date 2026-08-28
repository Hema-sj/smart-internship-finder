import dotenv from 'dotenv';
import sequelize from './config/database.js';
import { Company, Internship } from './models/index.js';

dotenv.config();

const updateUrls = async () => {
  try {
    console.log('🔗 Updating internship URLs...\n');
    
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');

    // Get all internships with their companies
    const internships = await Internship.findAll({
      include: [{ model: Company, as: 'company' }]
    });

    console.log(`Found ${internships.length} internships\n`);

    // Real career page URLs for major companies
    const companyUrls = {
      'Google': 'https://careers.google.com/jobs/results/',
      'Microsoft': 'https://careers.microsoft.com/professionals/us/en/search-results',
      'Amazon': 'https://www.amazon.jobs/en/search',
      'TCS': 'https://www.tcs.com/careers',
      'Infosys': 'https://www.infosys.com/careers.html',
      'Wipro': 'https://careers.wipro.com/careers-home/',
      'Cognizant': 'https://careers.cognizant.com/global/en',
      'HCL': 'https://www.hcltech.com/careers',
      'IBM': 'https://www.ibm.com/employment/',
      'Oracle': 'https://www.oracle.com/careers/',
      'Salesforce': 'https://www.salesforce.com/company/careers/',
      'SAP': 'https://jobs.sap.com/',
      'Accenture': 'https://www.accenture.com/in-en/careers',
      'Capgemini': 'https://www.capgemini.com/careers/',
      'Zoho': 'https://www.zoho.com/careers.html',
      'Freshworks': 'https://www.freshworks.com/company/careers/',
      'PayPal': 'https://careers.pypl.com/',
      'Dell': 'https://jobs.dell.com/',
      'Cisco': 'https://jobs.cisco.com/',
      'Adobe': 'https://careers.adobe.com/',
    };

    let updated = 0;

    for (const internship of internships) {
      const companyName = internship.company.companyName;
      
      // Find matching URL (check if company name contains any key)
      let url = null;
      for (const [key, value] of Object.entries(companyUrls)) {
        if (companyName.includes(key)) {
          url = value;
          break;
        }
      }

      // If no match found, use company website or default
      if (!url) {
        url = internship.company.website 
          ? `https://${internship.company.website.replace('https://', '').replace('http://', '')}/careers`
          : 'https://www.linkedin.com/jobs/';
      }

      // Update the internship
      await internship.update({ applicationUrl: url });
      console.log(`✓ ${companyName}: ${url}`);
      updated++;
    }

    console.log(`\n🎉 Updated ${updated} internship URLs!`);
    console.log('\n💡 Now when students click "Apply Now":');
    console.log('   • They will be directed to real company career pages');
    console.log('   • URLs open in new tab');
    console.log('   • Students can browse real job postings!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updateUrls();
