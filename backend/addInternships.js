import dotenv from 'dotenv';
import sequelize from './config/database.js';
import { Company, Internship } from './models/index.js';

dotenv.config();

const addInternships = async () => {
  try {
    console.log('🌱 Adding sample internships...\n');
    
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Get approved companies
    const companies = await Company.findAll({ 
      where: { verified_status: 'approved' },
      limit: 10 
    });

    if (companies.length === 0) {
      console.log('❌ No approved companies found!');
      process.exit(1);
    }

    console.log(`✅ Found ${companies.length} companies\n`);

    // Delete existing internships to start fresh
    await Internship.destroy({ where: {} });
    console.log('🗑️  Cleared existing internships\n');

    // Create diverse internships
    const internshipData = [
      {
        title: 'Full Stack Web Developer',
        description: 'Build modern web applications using React, Node.js, and cloud technologies. Work with experienced developers on real projects.',
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git', 'REST APIs'],
        duration: '3 months',
        location: 'Chennai, Tamil Nadu',
        mode: 'Hybrid',
        compensationType: 'Paid',
        stipend: 15000,
      },
      {
        title: 'Data Science Intern',
        description: 'Analyze large datasets, build ML models, create visualizations. Learn Python, machine learning, and data analysis.',
        requiredSkills: ['Python', 'Pandas', 'Machine Learning', 'SQL', 'Data Visualization', 'Statistics'],
        duration: '6 months',
        location: 'Chennai, Tamil Nadu',
        mode: 'On-site',
        compensationType: 'Paid',
        stipend: 20000,
      },
      {
        title: 'Mobile App Developer',
        description: 'Create native mobile apps for iOS and Android using React Native or Flutter. Work on user-facing features.',
        requiredSkills: ['React Native', 'Flutter', 'JavaScript', 'Mobile UI/UX', 'Firebase'],
        duration: '4 months',
        location: 'Chennai, Tamil Nadu',
        mode: 'Remote',
        compensationType: 'Paid',
        stipend: 18000,
      },
      {
        title: 'DevOps & Cloud Engineer',
        description: 'Work with AWS/Azure, Docker, Kubernetes. Automate deployments and manage infrastructure.',
        requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Linux', 'Python', 'CI/CD'],
        duration: '3 months',
        location: 'Chennai, Tamil Nadu',
        mode: 'Hybrid',
        compensationType: 'Paid',
        stipend: 22000,
      },
      {
        title: 'UI/UX Design Intern',
        description: 'Design beautiful interfaces using Figma. Conduct user research and create prototypes.',
        requiredSkills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Visual Design'],
        duration: '3 months',
        location: 'Chennai, Tamil Nadu',
        mode: 'On-site',
        compensationType: 'Paid',
        stipend: 12000,
      },
      {
        title: 'Backend Developer',
        description: 'Build scalable APIs using Node.js, Express, and databases. Learn microservices architecture.',
        requiredSkills: ['Node.js', 'Express', 'PostgreSQL', 'REST APIs', 'Microservices', 'Redis'],
        duration: '3 months',
        location: 'Chennai, Tamil Nadu',
        mode: 'Remote',
        compensationType: 'Paid',
        stipend: 16000,
      },
      {
        title: 'Machine Learning Engineer',
        description: 'Implement ML algorithms, train models using TensorFlow/PyTorch. Work on AI research projects.',
        requiredSkills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'NLP', 'Computer Vision'],
        duration: '6 months',
        location: 'Chennai, Tamil Nadu',
        mode: 'Hybrid',
        compensationType: 'Paid',
        stipend: 25000,
      },
      {
        title: 'Frontend Developer',
        description: 'Create responsive web interfaces using React, Vue, or Angular. Focus on performance and accessibility.',
        requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'TypeScript'],
        duration: '3 months',
        location: 'Chennai, Tamil Nadu',
        mode: 'Remote',
        compensationType: 'Paid',
        stipend: 14000,
      },
      {
        title: 'Cybersecurity Analyst',
        description: 'Learn security practices, vulnerability assessment, penetration testing. Work on security audits.',
        requiredSkills: ['Network Security', 'Ethical Hacking', 'Kali Linux', 'Python', 'Security Tools'],
        duration: '4 months',
        location: 'Chennai, Tamil Nadu',
        mode: 'On-site',
        compensationType: 'Paid',
        stipend: 20000,
      },
      {
        title: 'QA Automation Engineer',
        description: 'Write automated tests using Selenium, Cypress. Ensure software quality through testing.',
        requiredSkills: ['Selenium', 'Cypress', 'JavaScript', 'Test Automation', 'API Testing'],
        duration: '3 months',
        location: 'Chennai, Tamil Nadu',
        mode: 'Hybrid',
        compensationType: 'Paid',
        stipend: 13000,
      },
    ];

    // Create internships for each company
    const internships = [];
    let companyIndex = 0;

    for (const template of internshipData) {
      const company = companies[companyIndex % companies.length];
      
      internships.push({
        companyId: company.id,
        title: template.title,
        description: template.description,
        requiredSkills: template.requiredSkills,
        duration: template.duration,
        location: template.location,
        mode: template.mode,
        compensationType: template.compensationType,
        stipend: template.stipend,
        certificateType: 'Soft Copy',
        startingDate: new Date('2024-06-01'),
        applicationDeadline: new Date('2024-05-20'),
        applicationUrl: `https://${company.website || 'careers.example.com'}/apply`,
        status: 'Approved',
        courseRole: template.title,
      });
      
      companyIndex++;
    }

    await Internship.bulkCreate(internships);
    
    console.log(`✅ Created ${internships.length} internships\n`);
    console.log('📋 Internship Distribution:');
    
    for (const company of companies) {
      const count = internships.filter(i => i.companyId === company.id).length;
      if (count > 0) {
        console.log(`   ${company.companyName}: ${count} internship(s)`);
      }
    }

    console.log('\n🎉 Done! Students can now browse internships!');
    console.log('\n💡 Next steps:');
    console.log('   1. Login as student: http://localhost:5173/login');
    console.log('   2. Browse internships table');
    console.log('   3. Upload resume for AI matching');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

addInternships();
