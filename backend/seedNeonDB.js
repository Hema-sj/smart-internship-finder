import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import User from './models/User.js';
import Company from './models/Company.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    console.log(`📊 Database: ${process.env.POSTGRES_DB}`);
    console.log(`🌐 Host: ${process.env.POSTGRES_HOST}`);

    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Sync models
    await sequelize.sync({ force: false });
    console.log('✅ Models synchronized');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@smartintern.com' } });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists, deleting and recreating...');
      await existingAdmin.destroy();
    }
    
    // Create admin user (password will be auto-hashed by User model beforeCreate hook)
    await User.create({
      email: 'admin@smartintern.com',
      password: 'Admin@2024', // Plain password - will be hashed automatically
      role: 'admin',
      name: 'Admin User',
    });
    console.log('✅ Admin user created');
    console.log('   Email: admin@smartintern.com');
    console.log('   Password: Admin@2024');

    // Check if companies already exist
    const existingCompanies = await Company.count();
    if (existingCompanies > 0) {
      console.log(`⚠️  ${existingCompanies} companies already exist, skipping...`);
    } else {
      // Seed companies
      const companies = [
        {
          companyName: 'Tata Consultancy Services (TCS)',
          description: 'Leading IT services, consulting and business solutions organization',
          industry: 'Information Technology',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.tcs.com',
          size: '10000+',
          logoUrl: 'https://logo.clearbit.com/tcs.com',
          verified_status: 'approved',
        },
        {
          companyName: 'Infosys',
          description: 'Global leader in next-generation digital services and consulting',
          industry: 'Information Technology',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.infosys.com',
          size: '10000+',
          logoUrl: 'https://logo.clearbit.com/infosys.com',
          verified_status: 'approved',
        },
        {
          companyName: 'Wipro',
          description: 'Leading technology services and consulting company',
          industry: 'Information Technology',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.wipro.com',
          size: '10000+',
          logoUrl: 'https://logo.clearbit.com/wipro.com',
          verified_status: 'approved',
        },
        {
          companyName: 'Cognizant',
          description: 'Professional services company helping transform business, operating, and technology models',
          industry: 'Information Technology',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.cognizant.com',
          size: '10000+',
          logoUrl: 'https://logo.clearbit.com/cognizant.com',
          verified_status: 'approved',
        },
        {
          companyName: 'HCL Technologies',
          description: 'Next-generation global technology company helping enterprises reimagine their businesses',
          industry: 'Information Technology',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.hcltech.com',
          size: '10000+',
          logoUrl: 'https://logo.clearbit.com/hcltech.com',
          verified_status: 'approved',
        },
        {
          companyName: 'Amazon',
          description: 'Multinational technology company focusing on e-commerce, cloud computing, and AI',
          industry: 'Technology',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.amazon.jobs',
          size: '10000+',
          logoUrl: 'https://logo.clearbit.com/amazon.com',
          verified_status: 'approved',
        },
        {
          companyName: 'Google',
          description: 'Multinational technology company specializing in Internet services and products',
          industry: 'Technology',
          location: 'Chennai, Tamil Nadu',
          website: 'https://careers.google.com',
          size: '10000+',
          logoUrl: 'https://logo.clearbit.com/google.com',
          verified_status: 'approved',
        },
        {
          companyName: 'Microsoft',
          description: 'Global technology leader developing software, services, devices, and solutions',
          industry: 'Technology',
          location: 'Chennai, Tamil Nadu',
          website: 'https://careers.microsoft.com',
          size: '10000+',
          logoUrl: 'https://logo.clearbit.com/microsoft.com',
          verified_status: 'approved',
        },
        {
          companyName: 'Accenture',
          description: 'Leading global professional services company providing strategy and consulting',
          industry: 'Consulting',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.accenture.com',
          size: '10000+',
          logoUrl: 'https://logo.clearbit.com/accenture.com',
          verified_status: 'approved',
        },
        {
          companyName: 'Capgemini',
          description: 'Global leader in partnering with companies to transform and manage their business',
          industry: 'Consulting',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.capgemini.com',
          size: '10000+',
          logoUrl: 'https://logo.clearbit.com/capgemini.com',
          verified_status: 'approved',
        },
        {
          companyName: 'IBM',
          description: 'Leading hybrid cloud and AI company serving clients in more than 175 countries',
          industry: 'Technology',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.ibm.com',
          size: '10000+',
          logoUrl: 'https://logo.clearbit.com/ibm.com',
          verified_status: 'approved',
        },
        {
          companyName: 'Oracle',
          description: 'Integrated cloud application and platform services company',
          industry: 'Technology',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.oracle.com',
          size: '10000+',
          logoUrl: 'https://logo.clearbit.com/oracle.com',
          verified_status: 'approved',
        },
        {
          companyName: 'Salesforce',
          description: 'Global leader in CRM and enterprise cloud computing',
          industry: 'Technology',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.salesforce.com',
          size: '10000+',
          logoUrl: 'https://logo.clearbit.com/salesforce.com',
          verified_status: 'approved',
        },
        {
          companyName: 'SAP',
          description: 'Market leader in enterprise application software',
          industry: 'Technology',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.sap.com',
          size: '10000+',
          logoUrl: 'https://logo.clearbit.com/sap.com',
          verified_status: 'approved',
        },
        {
          companyName: 'Dell Technologies',
          description: 'Unique family of businesses providing infrastructure, devices, and services',
          industry: 'Technology',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.dell.com',
          size: '10000+',
          logoUrl: 'https://logo.clearbit.com/dell.com',
          verified_status: 'approved',
        },
        {
          companyName: 'Tech Mahindra',
          description: 'Leading provider of digital transformation, consulting, and business services',
          industry: 'Information Technology',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.techmahindra.com',
          size: '10000+',
          logoUrl: 'https://logo.clearbit.com/techmahindra.com',
          verified_status: 'approved',
        },
        {
          companyName: 'L&T Infotech',
          description: 'Global technology consulting and digital solutions company',
          industry: 'Information Technology',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.lntinfotech.com',
          size: '5000-10000',
          logoUrl: 'https://logo.clearbit.com/lntinfotech.com',
          verified_status: 'approved',
        },
        {
          companyName: 'Mphasis',
          description: 'Information Technology solutions provider specializing in cloud and cognitive services',
          industry: 'Information Technology',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.mphasis.com',
          size: '5000-10000',
          logoUrl: 'https://logo.clearbit.com/mphasis.com',
          verified_status: 'approved',
        },
        {
          companyName: 'Hexaware Technologies',
          description: 'Provider of IT, BPO and consulting services',
          industry: 'Information Technology',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.hexaware.com',
          size: '1000-5000',
          logoUrl: 'https://logo.clearbit.com/hexaware.com',
          verified_status: 'approved',
        },
        {
          companyName: 'Virtusa',
          description: 'Global provider of digital engineering and IT outsourcing services',
          industry: 'Information Technology',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.virtusa.com',
          size: '5000-10000',
          logoUrl: 'https://logo.clearbit.com/virtusa.com',
          verified_status: 'approved',
        },
        {
          companyName: 'Altimetrik',
          description: 'Digital business transformation services provider',
          industry: 'Information Technology',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.altimetrik.com',
          size: '1000-5000',
          logoUrl: 'https://logo.clearbit.com/altimetrik.com',
          verified_status: 'approved',
        },
        {
          companyName: 'Maveric Systems',
          description: 'Banking and financial services IT solutions provider',
          industry: 'Information Technology',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.mavericsystems.com',
          size: '1000-5000',
          logoUrl: 'https://logo.clearbit.com/mavericsystems.com',
          verified_status: 'approved',
        },
        {
          companyName: 'Freshworks',
          description: 'Customer engagement software company',
          industry: 'Software',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.freshworks.com',
          size: '1000-5000',
          logoUrl: 'https://logo.clearbit.com/freshworks.com',
          verified_status: 'approved',
        },
        {
          companyName: 'Zoho Corporation',
          description: 'Software development company offering web-based business tools',
          industry: 'Software',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.zoho.com',
          size: '5000-10000',
          logoUrl: 'https://logo.clearbit.com/zoho.com',
          verified_status: 'approved',
        },
        {
          companyName: 'PayPal',
          description: 'Digital payments and money transfers platform',
          industry: 'Fintech',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.paypal.com',
          size: '10000+',
          logoUrl: 'https://logo.clearbit.com/paypal.com',
          verified_status: 'approved',
        },
        {
          companyName: 'Bosch',
          description: 'Leading global supplier of technology and services',
          industry: 'Engineering',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.bosch.com',
          size: '10000+',
          logoUrl: 'https://logo.clearbit.com/bosch.com',
          verified_status: 'approved',
        },
        {
          companyName: 'Renault Nissan',
          description: 'Automotive manufacturer and technology company',
          industry: 'Automotive',
          location: 'Chennai, Tamil Nadu',
          website: 'https://www.renault-nissan.com',
          size: '10000+',
          logoUrl: 'https://logo.clearbit.com/renault.com',
          verified_status: 'approved',
        },
      ];

      await Company.bulkCreate(companies);
      console.log(`✅ ${companies.length} companies seeded`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 You can now login with:');
    console.log('   Email: admin@smartintern.com');
    console.log('   Password: Admin@2024');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
