import { Internship, Company } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

async function seedMoreInternships() {
  try {
    console.log('🌱 Seeding more internships...');

    // Find companies
    const companies = await Company.findAll();
    
    if (companies.length === 0) {
      console.log('❌ No companies found. Please run seedCompaniesPostgres.js first.');
      process.exit(1);
    }

    const locations = [
      'Bangalore', 'Chennai', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi', 
      'Kolkata', 'Ahmedabad', 'Noida', 'Gurugram', 'Kochi', 'Coimbatore',
      'Jaipur', 'Dehradun', 'Bhubaneswar', 'Guwahati', 'Thiruvananthapuram'
    ];

    const roles = [
      'Software Engineering Intern',
      'Data Science Intern',
      'Full Stack Developer Intern',
      'Frontend Developer Intern',
      'Backend Developer Intern',
      'Machine Learning Intern',
      'DevOps Intern',
      'Cloud Engineering Intern',
      'Product Management Intern',
      'UI/UX Design Intern',
      'Mobile App Developer Intern',
      'Cybersecurity Intern',
      'Business Analyst Intern',
      'Marketing Intern',
      'Sales Intern'
    ];

    const skills = [
      ['JavaScript', 'React', 'Node.js'],
      ['Python', 'Machine Learning', 'TensorFlow'],
      ['Java', 'Spring Boot', 'MySQL'],
      ['AWS', 'Docker', 'Kubernetes'],
      ['React Native', 'Flutter', 'Mobile Development'],
      ['Figma', 'Adobe XD', 'UI/UX'],
      ['Data Analysis', 'SQL', 'Excel'],
      ['C++', 'Algorithms', 'Data Structures']
    ];

    const internshipsToCreate = [];

    // Create 50 internships
    for (let i = 0; i < 50; i++) {
      const company = companies[Math.floor(Math.random() * companies.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const role = roles[Math.floor(Math.random() * roles.length)];
      const skillSet = skills[Math.floor(Math.random() * skills.length)];
      const isPaid = Math.random() > 0.3; // 70% paid
      
      internshipsToCreate.push({
        _id: uuidv4(),
        title: role,
        company: {
          _id: company.id,
          name: company.companyName,
          logo: company.logo || 'https://via.placeholder.com/100',
        },
        companyId: company.id,
        location: location,
        duration: `${Math.floor(Math.random() * 4 + 2)} months`,
        stipend: isPaid ? `₹${(Math.floor(Math.random() * 20) + 10) * 1000}/month` : 'Unpaid',
        compensationType: isPaid ? 'paid' : 'unpaid',
        mode: ['Remote', 'On-site', 'Hybrid'][Math.floor(Math.random() * 3)],
        startDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date in next 90 days
        applicationDeadline: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        description: `Exciting ${role} opportunity at ${company.companyName} in ${location}. Work on cutting-edge projects and gain real-world experience.`,
        responsibilities: [
          'Work with senior engineers on real projects',
          'Participate in code reviews and team meetings',
          'Learn industry best practices',
          'Contribute to product development'
        ],
        requirements: [
          'Currently pursuing Bachelor\'s/Master\'s degree',
          'Strong problem-solving skills',
          ...skillSet.map(s => `Knowledge of ${s}`)
        ],
        skills: skillSet,
        perks: [
          'Certificate of completion',
          'Letter of recommendation',
          'Mentorship from industry experts',
          'Flexible working hours'
        ],
        applyLink: company.website || 'https://example.com/apply',
        postedDate: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000), // Posted in last 15 days
        openings: Math.floor(Math.random() * 5) + 1,
        applicants: Math.floor(Math.random() * 100),
        certificate: Math.random() > 0.5,
      });
    }

    // Bulk insert
    await Internship.bulkCreate(internshipsToCreate);

    console.log(`✅ Successfully seeded ${internshipsToCreate.length} internships!`);
    
    // Show summary
    const summary = {};
    internshipsToCreate.forEach(i => {
      summary[i.location] = (summary[i.location] || 0) + 1;
    });
    
    console.log('\n📊 Internships by location:');
    Object.entries(summary).sort((a, b) => b[1] - a[1]).forEach(([loc, count]) => {
      console.log(`   ${loc}: ${count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding internships:', error);
    process.exit(1);
  }
}

seedMoreInternships();
