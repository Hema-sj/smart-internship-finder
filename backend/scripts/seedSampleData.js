import 'dotenv/config';
import sequelize from '../config/database.js';
import Company from '../models/Company.js';
import Internship from '../models/Internship.js';
import User from '../models/User.js';

async function seedSampleData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL\n');

    // Check if data already exists
    const existingInternships = await Internship.count();
    if (existingInternships > 0) {
      console.log('⚠️  Database already has internships. Skipping seed.');
      console.log(`   Current count: ${existingInternships} internships`);
      await sequelize.close();
      return;
    }

    console.log('📦 Seeding sample data...\n');

    // Check if company users exist, or create them
    const companyEmails = [
      'recruiter@google.com',
      'recruiter@microsoft.com',
      'recruiter@amazon.com',
      'recruiter@zoho.com'
    ];

    const companyUsers = [];
    for (let i = 0; i < companyEmails.length; i++) {
      let user = await User.findOne({ where: { email: companyEmails[i] } });
      if (!user) {
        const names = ['Google Recruiter', 'Microsoft Recruiter', 'Amazon Recruiter', 'Zoho Recruiter'];
        user = await User.create({
          name: names[i],
          email: companyEmails[i],
          password: 'password123',
          role: 'company'
        });
      }
      companyUsers.push(user);
    }

    console.log('✅ Company users ready\n');

    // Check if companies exist, or create them
    const companyNames = ['Google', 'Microsoft', 'Amazon', 'Zoho'];
    const companies = [];
    
    for (let i = 0; i < companyNames.length; i++) {
      let company = await Company.findOne({ where: { companyName: companyNames[i] } });
      if (!company) {
        const companyData = [
          {
            companyName: 'Google',
            website: 'https://careers.google.com',
            careersUrl: 'https://www.google.com/about/careers/applications/',
            industry: 'Technology',
            logo: 'https://logo.clearbit.com/google.com',
            description: 'Google is a global technology leader focused on improving the ways people connect with information.'
          },
          {
            companyName: 'Microsoft',
            website: 'https://careers.microsoft.com',
            careersUrl: 'https://careers.microsoft.com/v2/global/en/students',
            industry: 'Technology',
            logo: 'https://logo.clearbit.com/microsoft.com',
            description: 'Microsoft is a leading platform and productivity company for the mobile-first, cloud-first world.'
          },
          {
            companyName: 'Amazon',
            website: 'https://amazon.jobs',
            careersUrl: 'https://amazon.jobs/content/en/career-programs/university/internships-for-students',
            industry: 'E-commerce & Technology',
            logo: 'https://logo.clearbit.com/amazon.com',
            description: 'Amazon is guided by four principles: customer obsession, passion for invention, commitment to operational excellence, and long-term thinking.'
          },
          {
            companyName: 'Zoho',
            website: 'https://www.zoho.com/careers',
            careersUrl: 'https://www.zoho.com/careers/',
            industry: 'Software',
            logo: 'https://logo.clearbit.com/zoho.com',
            description: 'Zoho Corporation is an Indian software development company that provides web-based business tools.'
          }
        ];
        
        company = await Company.create({
          userId: companyUsers[i].id,
          ...companyData[i],
          verified_status: 'approved'
        });
      }
      companies.push(company);
    }

    console.log('✅ Companies ready\n');

    // Create sample internships with real official application links
    const internships = [
      {
        companyId: companies[0].id,
        title: 'Software Engineering Intern',
        courseRole: 'Software Development',
        description: 'Work on cutting-edge projects with Google engineers. Contribute to products used by billions of users worldwide.',
        location: 'Bangalore',
        mode: 'Hybrid',
        duration: '10-12 weeks',
        startingDate: new Date('2026-06-01'),
        applicationDeadline: new Date('2026-05-15'),
        requiredSkills: ['Python', 'JavaScript', 'React', 'Node.js', 'Algorithms'],
        compensationType: 'Paid',
        stipend: 80000,
        status: 'Approved',
        applicationStatus: 'Open',
        certificateProvided: true,
        certificateType: 'Both',
        certificateDetails: 'Certificate provided upon successful completion',
        applicationUrl: 'https://www.google.com/about/careers/applications/',
        sourceUrl: 'https://www.google.com/about/careers/applications/',
        sourceName: 'Google Careers',
        sourceVerified: true,
        isVerified: true,
        lastVerifiedAt: new Date()
      },
      {
        companyId: companies[0].id,
        title: 'Data Science Intern',
        courseRole: 'Data Science',
        description: 'Analyze large datasets and build machine learning models to solve real-world problems.',
        location: 'Hyderabad',
        mode: 'On-site',
        duration: '12 weeks',
        startingDate: new Date('2026-07-01'),
        applicationDeadline: new Date('2026-06-15'),
        requiredSkills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics'],
        compensationType: 'Paid',
        stipend: 85000,
        status: 'Approved',
        applicationStatus: 'Open',
        certificateProvided: true,
        certificateType: 'Soft Copy',
        certificateDetails: 'Digital certificate via email',
        applicationUrl: 'https://www.google.com/about/careers/applications/',
        sourceUrl: 'https://www.google.com/about/careers/applications/',
        sourceName: 'Google Careers',
        sourceVerified: true,
        isVerified: true,
        lastVerifiedAt: new Date()
      },
      {
        companyId: companies[1].id,
        title: 'Full Stack Developer Intern',
        courseRole: 'Web Development',
        description: 'Build web applications using modern technologies. Work with Azure cloud services and DevOps practices.',
        location: 'Chennai',
        mode: 'Remote',
        duration: '6 months',
        startingDate: new Date('2026-06-15'),
        applicationDeadline: new Date('2026-06-01'),
        requiredSkills: ['React', 'Node.js', 'TypeScript', 'Azure', 'Git'],
        compensationType: 'Paid',
        stipend: 60000,
        status: 'Approved',
        applicationStatus: 'Open',
        certificateProvided: true,
        certificateType: 'Both',
        certificateDetails: 'Physical and digital certificates provided',
        applicationUrl: 'https://careers.microsoft.com/v2/global/en/students',
        sourceUrl: 'https://careers.microsoft.com/v2/global/en/students',
        sourceName: 'Microsoft University Recruiting',
        sourceVerified: true,
        isVerified: true,
        lastVerifiedAt: new Date()
      },
      {
        companyId: companies[1].id,
        title: 'Cloud Engineering Intern',
        courseRole: 'Cloud Computing',
        description: 'Work on Azure cloud infrastructure and learn about distributed systems at scale.',
        location: 'Mumbai',
        mode: 'Hybrid',
        duration: '4 months',
        startingDate: new Date('2026-08-01'),
        applicationDeadline: new Date('2026-07-15'),
        requiredSkills: ['Azure', 'Docker', 'Kubernetes', 'Linux', 'Python'],
        compensationType: 'Paid',
        stipend: 70000,
        status: 'Approved',
        applicationStatus: 'Open',
        certificateProvided: true,
        certificateType: 'Hard Copy',
        certificateDetails: 'Official certificate sent by mail',
        applicationUrl: 'https://careers.microsoft.com/v2/global/en/students',
        sourceUrl: 'https://careers.microsoft.com/v2/global/en/students',
        sourceName: 'Microsoft University Recruiting',
        sourceVerified: true,
        isVerified: true,
        lastVerifiedAt: new Date()
      },
      {
        companyId: companies[2].id,
        title: 'AWS Cloud Intern',
        courseRole: 'Cloud Computing',
        description: 'Learn and work on AWS services including EC2, S3, Lambda, and more. Gain hands-on experience with cloud architecture.',
        location: 'Pune',
        mode: 'On-site',
        duration: '6 months',
        startingDate: new Date('2026-07-01'),
        applicationDeadline: new Date('2026-06-20'),
        requiredSkills: ['AWS', 'Python', 'DevOps', 'CI/CD', 'Terraform'],
        compensationType: 'Paid',
        stipend: 75000,
        status: 'Approved',
        applicationStatus: 'Open',
        certificateProvided: true,
        certificateType: 'Both',
        certificateDetails: 'Certificate upon completion',
        applicationUrl: 'https://amazon.jobs/content/en/career-programs/university/internships-for-students',
        sourceUrl: 'https://amazon.jobs/content/en/career-programs/university/internships-for-students',
        sourceName: 'Amazon Student Programs',
        sourceVerified: true,
        isVerified: true,
        lastVerifiedAt: new Date()
      },
      {
        companyId: companies[2].id,
        title: 'Frontend Developer Intern',
        courseRole: 'Frontend Development',
        description: 'Build user interfaces for Amazon products. Work with React, TypeScript, and AWS services.',
        location: 'Delhi',
        mode: 'Remote',
        duration: '3 months',
        startingDate: new Date('2026-09-01'),
        applicationDeadline: new Date('2026-08-15'),
        requiredSkills: ['React', 'TypeScript', 'CSS', 'JavaScript', 'HTML'],
        compensationType: 'Paid',
        stipend: 65000,
        status: 'Approved',
        applicationStatus: 'Open',
        certificateProvided: true,
        certificateType: 'Soft Copy',
        certificateDetails: 'Digital certificate',
        applicationUrl: 'https://amazon.jobs/content/en/career-programs/university/internships-for-students',
        sourceUrl: 'https://amazon.jobs/content/en/career-programs/university/internships-for-students',
        sourceName: 'Amazon Student Programs',
        sourceVerified: true,
        isVerified: true,
        lastVerifiedAt: new Date()
      },
      {
        companyId: companies[3].id,
        title: 'Product Development Intern',
        courseRole: 'Software Development',
        description: 'Work on Zoho products development. Build features used by millions of businesses worldwide.',
        location: 'Chennai',
        mode: 'On-site',
        duration: '6 months',
        startingDate: new Date('2026-06-01'),
        applicationDeadline: new Date('2026-05-25'),
        requiredSkills: ['Java', 'Spring Boot', 'MySQL', 'REST API', 'Microservices'],
        compensationType: 'Paid',
        stipend: 40000,
        status: 'Approved',
        applicationStatus: 'Open',
        certificateProvided: true,
        certificateType: 'Both',
        certificateDetails: 'Certificate of completion provided',
        applicationUrl: 'https://www.zoho.com/careers/',
        sourceUrl: 'https://www.zoho.com/careers/',
        sourceName: 'Zoho Careers',
        sourceVerified: true,
        isVerified: true,
        lastVerifiedAt: new Date()
      },
      {
        companyId: companies[3].id,
        title: 'UI/UX Design Intern',
        courseRole: 'Design',
        description: 'Design user experiences for Zoho applications. Create intuitive interfaces for business software.',
        location: 'Coimbatore',
        mode: 'Hybrid',
        duration: '4 months',
        startingDate: new Date('2026-07-15'),
        applicationDeadline: new Date('2026-07-01'),
        requiredSkills: ['Figma', 'Adobe XD', 'UI Design', 'Prototyping', 'User Research'],
        compensationType: 'Paid',
        stipend: 35000,
        status: 'Approved',
        applicationStatus: 'Open',
        certificateProvided: true,
        certificateType: 'Hard Copy',
        certificateDetails: 'Official certificate mailed',
        applicationUrl: 'https://www.zoho.com/careers/',
        sourceUrl: 'https://www.zoho.com/careers/',
        sourceName: 'Zoho Careers',
        sourceVerified: true,
        isVerified: true,
        lastVerifiedAt: new Date()
      }
    ];

    await Internship.bulkCreate(internships);
    console.log('✅ Created 8 sample internships\n');

    // Summary
    const totalCompanies = await Company.count();
    const totalInternships = await Internship.count();
    
    console.log('📊 Seeding Summary:');
    console.log(`   Companies: ${totalCompanies}`);
    console.log(`   Internships: ${totalInternships}`);
    console.log('\n✅ Database seeded successfully!\n');

    await sequelize.close();
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    console.error(error);
  }
}

seedSampleData();
