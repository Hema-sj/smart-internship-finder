/**
 * Seed script — run once to populate internships in MongoDB.
 * Usage: node backend/scripts/seedInternships.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import Internship from '../models/Internship.js';
import Company from '../models/Company.js';

const companies = [
  { name: 'Razorpay', website: 'https://razorpay.com', location: 'Bangalore', description: 'India\'s leading payment gateway.' },
  { name: 'Zoho', website: 'https://zoho.com', location: 'Chennai', description: 'Business software suite used by 100M+ users.' },
  { name: 'Freshworks', website: 'https://freshworks.com', location: 'Chennai', description: 'Cloud-based business software for teams.' },
  { name: 'TCS', website: 'https://tcs.com', location: 'Coimbatore', description: 'Global IT services and consulting.' },
  { name: 'Infosys', website: 'https://infosys.com', location: 'Hyderabad', description: 'Digital services and consulting.' },
  { name: 'CRED', website: 'https://cred.club', location: 'Bangalore', description: 'Fintech startup rewarding credit card users.' },
  { name: 'Postman', website: 'https://postman.com', location: 'Bangalore', description: 'API platform for building and testing APIs.' },
  { name: 'Sarvam AI', website: 'https://sarvam.ai', location: 'Remote', description: 'India\'s frontier AI startup.' },
  { name: 'Swiggy', website: 'https://swiggy.com', location: 'Bangalore', description: 'Food delivery & quick commerce platform.' },
  { name: 'PhonePe', website: 'https://phonepe.com', location: 'Bangalore', description: 'Digital payments app with 500M+ users.' },
  { name: 'Ola', website: 'https://olacabs.com', location: 'Bangalore', description: 'Mobility & EV company.' },
  { name: 'Meesho', website: 'https://meesho.com', location: 'Bangalore', description: 'Social commerce platform for small businesses.' },
];

const internshipTemplates = [
  { title: 'Software Engineering Intern', course: 'Software Engineering', compensationType: 'Paid', stipend: 35000, location: 'Bangalore', mode: 'onsite', duration: '3 months', certificateType: 'Soft Copy', aiMatch: 96, description: 'Work with our core payments infra team on distributed systems and APIs. You will write production-grade code from week one.' },
  { title: 'Data Science Intern', course: 'Data Science', compensationType: 'Paid', stipend: 25000, location: 'Chennai', mode: 'hybrid', duration: '2 months', certificateType: 'Both', aiMatch: 91, description: 'Analyze large datasets, build predictive models, and support business intelligence dashboards.' },
  { title: 'Frontend Developer Intern', course: 'Frontend Development', compensationType: 'Paid', stipend: 20000, location: 'Chennai', mode: 'onsite', duration: '3 months', certificateType: 'Soft Copy', aiMatch: 89, description: 'Build delightful user interfaces with React and contribute to our design system.' },
  { title: 'Machine Learning Intern', course: 'Machine Learning', compensationType: 'Unpaid', stipend: 0, location: 'Coimbatore', mode: 'onsite', duration: '2 months', certificateType: 'Hard Copy', aiMatch: 84, description: 'Train and evaluate ML models for NLP and computer vision use cases.' },
  { title: 'Cloud Engineering Intern', course: 'Cloud Engineering', compensationType: 'Paid', stipend: 18000, location: 'Hyderabad', mode: 'hybrid', duration: '3 months', certificateType: 'Soft Copy', aiMatch: 82, description: 'Deploy and manage cloud infrastructure on AWS. Work with Docker, Kubernetes, and Terraform.' },
  { title: 'Product Design Intern', course: 'Product Design', compensationType: 'Paid', stipend: 30000, location: 'Bangalore', mode: 'onsite', duration: '3 months', certificateType: 'Both', aiMatch: 78, description: 'Design intuitive product experiences, run user research sessions, and prototype new features in Figma.' },
  { title: 'Backend Developer Intern', course: 'Backend Development', compensationType: 'Paid', stipend: 28000, location: 'Bangalore', mode: 'onsite', duration: '3 months', certificateType: 'Soft Copy', aiMatch: 86, description: 'Build scalable REST APIs using Node.js and MongoDB. Work on high-throughput microservices.' },
  { title: 'AI Research Intern', course: 'AI Research', compensationType: 'Unpaid', stipend: 0, location: 'Remote', mode: 'remote', duration: '3 months', certificateType: 'No Certificate', aiMatch: 80, description: 'Research large language models, contribute to open-source AI initiatives, and co-author papers.' },
  { title: 'DevOps Intern', course: 'DevOps', compensationType: 'Paid', stipend: 22000, location: 'Bangalore', mode: 'hybrid', duration: '2 months', certificateType: 'Soft Copy', aiMatch: 77, description: 'Set up CI/CD pipelines, monitor production systems, and improve deployment reliability.' },
  { title: 'Android Development Intern', course: 'Mobile Development', compensationType: 'Paid', stipend: 24000, location: 'Bangalore', mode: 'onsite', duration: '3 months', certificateType: 'Soft Copy', aiMatch: 88, description: 'Build features in our Android app used by millions of customers daily.' },
  { title: 'Business Analytics Intern', course: 'Business Analytics', compensationType: 'Paid', stipend: 15000, location: 'Bangalore', mode: 'hybrid', duration: '2 months', certificateType: 'Both', aiMatch: 72, description: 'Deep-dive into product metrics, build dashboards, and surface insights for product and leadership teams.' },
  { title: 'Cybersecurity Intern', course: 'Cybersecurity', compensationType: 'Unpaid', stipend: 0, location: 'Remote', mode: 'remote', duration: '2 months', certificateType: 'Hard Copy', aiMatch: 75, description: 'Conduct penetration testing, audit security configurations, and help draft security policies.' },
];

const now = new Date();
function futureDate(days) { const d = new Date(now); d.setDate(d.getDate() + days); return d; }

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  await Internship.deleteMany({});
  await Company.deleteMany({});
  console.log('Cleared existing data');

  const createdCompanies = await Company.insertMany(
    companies.map(c => ({ ...c, verified: true, rating: +(3.5 + Math.random() * 1.5).toFixed(1), reviewCount: Math.floor(Math.random() * 200 + 20) }))
  );

  const internships = internshipTemplates.map((template, i) => ({
    ...template,
    companyId: createdCompanies[i % createdCompanies.length]._id,
    startDate: futureDate(10 + i * 5),
    applicationDeadline: futureDate(5 + i * 3),
    requiredSkills: [],
    companyWebsite: createdCompanies[i % createdCompanies.length].website,
    internshipDetailsUrl: '#',
    applicationUrl: '#',
    status: 'Open',
  }));

  await Internship.insertMany(internships);
  console.log(`Seeded ${internships.length} internships across ${createdCompanies.length} companies.`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
