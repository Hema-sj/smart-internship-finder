/**
 * Seed script — populates MongoDB with realistic internships across all 9 locations.
 * Run from the backend directory: node scripts/seedInternships.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import Internship from '../models/Internship.js';
import Company from '../models/Company.js';

// ─── Companies ───────────────────────────────────────────────────────────────
const COMPANIES = [
  { name: 'Razorpay',     location: 'Bangalore',  website: 'https://razorpay.com',     description: 'India\'s leading payments infrastructure company.' },
  { name: 'Zoho',         location: 'Chennai',     website: 'https://zoho.com',          description: 'Business software used by 100M+ users globally.' },
  { name: 'Freshworks',   location: 'Chennai',     website: 'https://freshworks.com',    description: 'SaaS platform for customer and employee engagement.' },
  { name: 'TCS',          location: 'Coimbatore',  website: 'https://tcs.com',           description: 'Global IT services and consulting leader.' },
  { name: 'Infosys',      location: 'Hyderabad',   website: 'https://infosys.com',       description: 'Digital services and next-gen consulting.' },
  { name: 'CRED',         location: 'Bangalore',   website: 'https://cred.club',         description: 'Fintech startup rewarding creditworthy behaviour.' },
  { name: 'Postman',      location: 'Bangalore',   website: 'https://postman.com',       description: 'World\'s leading API development platform.' },
  { name: 'Sarvam AI',    location: 'Remote',      website: 'https://sarvam.ai',         description: 'India\'s frontier generative AI startup.' },
  { name: 'Swiggy',       location: 'Bangalore',   website: 'https://swiggy.com',        description: 'Food delivery and quick commerce platform.' },
  { name: 'PhonePe',      location: 'Bangalore',   website: 'https://phonepe.com',       description: 'Digital payments app with 500M+ users.' },
  { name: 'Ola',          location: 'Bangalore',   website: 'https://olacabs.com',       description: 'Mobility and electric vehicle company.' },
  { name: 'Meesho',       location: 'Bangalore',   website: 'https://meesho.com',        description: 'Social commerce for small businesses.' },
  { name: 'ClearTax',     location: 'Bangalore',   website: 'https://cleartax.in',       description: 'India\'s #1 tax and financial services platform.' },
  { name: 'Byju\'s',      location: 'Bangalore',   website: 'https://byjus.com',         description: 'World\'s largest edtech company.' },
  { name: 'Juspay',       location: 'Bangalore',   website: 'https://juspay.in',         description: 'Payments orchestration platform.' },
  { name: 'Hexaware',     location: 'Mumbai',      website: 'https://hexaware.com',      description: 'Global technology and business services firm.' },
  { name: 'Persistent',   location: 'Pune',        website: 'https://persistent.com',    description: 'Digital engineering and cloud services.' },
  { name: 'Tekion',       location: 'Hyderabad',   website: 'https://tekion.com',        description: 'AI-native DMS platform for the auto industry.' },
  { name: 'IIT Madras',   location: 'Chennai',     website: 'https://iitm.ac.in',        description: 'Premier research institution offering student opportunities.' },
  { name: 'Leegality',    location: 'Delhi',        website: 'https://leegality.com',     description: 'India\'s leading digital document infrastructure.' },
  { name: 'Shiprocket',   location: 'Delhi',        website: 'https://shiprocket.in',     description: 'India\'s largest D2C enablement platform.' },
  { name: 'UST Global',   location: 'Kochi',       website: 'https://ust.com',           description: 'Digital transformation solutions partner.' },
  { name: 'IBS Software', location: 'Kochi',       website: 'https://ibsplc.com',        description: 'Mission-critical software for travel and transport.' },
  { name: 'Wipro',        location: 'Coimbatore',  website: 'https://wipro.com',         description: 'Global information technology company.' },
];

// ─── Internship templates (one per company) ──────────────────────────────────
const TEMPLATES = [
  { title: 'Software Engineering Intern',   course: 'Software Engineering',    compensationType: 'Paid',   stipend: 35000, mode: 'onsite',  duration: '3 months',  certificateType: 'Soft Copy', aiMatch: 96, description: 'Work with the core payments infrastructure team on distributed systems and high-throughput APIs. You will ship production code from week one.' },
  { title: 'Data Science Intern',           course: 'Data Science',             compensationType: 'Paid',   stipend: 25000, mode: 'hybrid',  duration: '2 months',  certificateType: 'Both',      aiMatch: 91, description: 'Build ML models to predict customer behaviour and automate business reporting pipelines using Python and SQL.' },
  { title: 'Frontend Developer Intern',     course: 'Frontend Development',     compensationType: 'Paid',   stipend: 20000, mode: 'onsite',  duration: '3 months',  certificateType: 'Soft Copy', aiMatch: 89, description: 'Build performant React components and contribute to the design system used across all Freshworks products.' },
  { title: 'Machine Learning Intern',       course: 'Machine Learning',         compensationType: 'Unpaid', stipend: 0,     mode: 'onsite',  duration: '2 months',  certificateType: 'Hard Copy', aiMatch: 84, description: 'Train and evaluate NLP and computer vision models for enterprise document classification.' },
  { title: 'Cloud Engineering Intern',      course: 'Cloud Engineering',        compensationType: 'Paid',   stipend: 18000, mode: 'hybrid',  duration: '3 months',  certificateType: 'Soft Copy', aiMatch: 82, description: 'Deploy and maintain AWS infrastructure using Terraform and Kubernetes. Improve system reliability and reduce cloud costs.' },
  { title: 'Product Design Intern',         course: 'Product Design',           compensationType: 'Paid',   stipend: 30000, mode: 'onsite',  duration: '3 months',  certificateType: 'Both',      aiMatch: 78, description: 'Design and prototype product experiences in Figma, run usability studies, and work with product managers to define features.' },
  { title: 'Backend Developer Intern',      course: 'Backend Development',      compensationType: 'Paid',   stipend: 28000, mode: 'onsite',  duration: '3 months',  certificateType: 'Soft Copy', aiMatch: 86, description: 'Build scalable REST APIs with Node.js and MongoDB. Work on high-throughput microservices handling millions of API calls daily.' },
  { title: 'AI Research Intern',            course: 'AI Research',              compensationType: 'Unpaid', stipend: 0,     mode: 'remote',  duration: '3 months',  certificateType: 'No Certificate', aiMatch: 80, description: 'Contribute to LLM fine-tuning experiments for Indic language understanding. Co-author research papers.' },
  { title: 'DevOps Intern',                 course: 'DevOps',                   compensationType: 'Paid',   stipend: 22000, mode: 'hybrid',  duration: '2 months',  certificateType: 'Soft Copy', aiMatch: 77, description: 'Set up and maintain CI/CD pipelines. Monitor production systems with Grafana and PagerDuty. Improve deployment reliability.' },
  { title: 'Android Development Intern',    course: 'Mobile Development',       compensationType: 'Paid',   stipend: 24000, mode: 'onsite',  duration: '3 months',  certificateType: 'Soft Copy', aiMatch: 88, description: 'Build and ship features in the PhonePe Android app used by 500M+ customers. Work with Kotlin and Jetpack Compose.' },
  { title: 'Business Analytics Intern',     course: 'Business Analytics',       compensationType: 'Paid',   stipend: 15000, mode: 'hybrid',  duration: '2 months',  certificateType: 'Both',      aiMatch: 72, description: 'Deep-dive into ride and EV product metrics. Build dashboards in Tableau and surface insights for leadership.' },
  { title: 'Growth & Marketing Intern',     course: 'Marketing',                compensationType: 'Paid',   stipend: 12000, mode: 'hybrid',  duration: '2 months',  certificateType: 'Both',      aiMatch: 68, description: 'Run A/B experiments on seller acquisition funnels. Analyse retention data and create content for social campaigns.' },
  { title: 'Fintech Product Intern',        course: 'Product Management',       compensationType: 'Paid',   stipend: 32000, mode: 'onsite',  duration: '3 months',  certificateType: 'Soft Copy', aiMatch: 85, description: 'Define, prioritise, and ship features for the ClearTax GST filing product used by 6M+ businesses.' },
  { title: 'EdTech Content Intern',         course: 'Education Technology',     compensationType: 'Unpaid', stipend: 0,     mode: 'remote',  duration: '2 months',  certificateType: 'Hard Copy', aiMatch: 65, description: 'Create high-quality engineering and maths content for Byju\'s Class 11–12 and JEE preparation modules.' },
  { title: 'Payments Backend Intern',       course: 'Backend Development',      compensationType: 'Paid',   stipend: 26000, mode: 'onsite',  duration: '3 months',  certificateType: 'Soft Copy', aiMatch: 87, description: 'Work on Juspay\'s payments router that processes billions of transactions. Focus on Haskell microservices and fault tolerance.' },
  { title: 'Full-Stack Developer Intern',   course: 'Full-Stack Development',   compensationType: 'Paid',   stipend: 20000, mode: 'hybrid',  duration: '3 months',  certificateType: 'Both',      aiMatch: 83, description: 'Build internal tooling and customer-facing features using React and Node.js for enterprise banking clients.' },
  { title: 'QA Automation Intern',          course: 'Quality Assurance',        compensationType: 'Paid',   stipend: 16000, mode: 'onsite',  duration: '2 months',  certificateType: 'Soft Copy', aiMatch: 74, description: 'Write automation test suites using Playwright and Jest for digital transformation products.' },
  { title: 'Data Engineering Intern',       course: 'Data Engineering',         compensationType: 'Paid',   stipend: 22000, mode: 'hybrid',  duration: '3 months',  certificateType: 'Soft Copy', aiMatch: 79, description: 'Build and maintain ETL pipelines using PySpark and Airflow for automotive analytics dashboards.' },
  { title: 'Research Intern — NLP',         course: 'Natural Language Processing', compensationType: 'Unpaid', stipend: 0, mode: 'onsite', duration: '3 months', certificateType: 'Both',      aiMatch: 81, description: 'Work on Tamil and Telugu NLP models at IIT Madras. Publish findings in top-tier NLP venues.' },
  { title: 'LegalTech Product Intern',      course: 'Product Management',       compensationType: 'Paid',   stipend: 18000, mode: 'hybrid',  duration: '2 months',  certificateType: 'Soft Copy', aiMatch: 70, description: 'Help define the roadmap for India\'s digital document signing product. Work with enterprise legal teams.' },
  { title: 'Logistics Tech Intern',         course: 'Software Engineering',     compensationType: 'Paid',   stipend: 20000, mode: 'onsite',  duration: '3 months',  certificateType: 'Soft Copy', aiMatch: 76, description: 'Build and optimise order tracking and warehouse management features for Shiprocket\'s logistics platform.' },
  { title: 'Enterprise Software Intern',    course: 'Software Engineering',     compensationType: 'Paid',   stipend: 22000, mode: 'onsite',  duration: '3 months',  certificateType: 'Both',      aiMatch: 78, description: 'Contribute to mission-critical digital transformation projects for Fortune 500 clients at UST Global.' },
  { title: 'Aviation Systems Intern',       course: 'Systems Engineering',      compensationType: 'Paid',   stipend: 20000, mode: 'onsite',  duration: '3 months',  certificateType: 'Hard Copy', aiMatch: 75, description: 'Work on flight operations management systems used by 200+ airlines worldwide at IBS Software.' },
  { title: 'Cybersecurity Intern',          course: 'Cybersecurity',            compensationType: 'Unpaid', stipend: 0,     mode: 'onsite',  duration: '2 months',  certificateType: 'Hard Copy', aiMatch: 73, description: 'Conduct penetration testing, audit configurations, and help draft security policies for Wipro enterprise clients.' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function futureDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

// ─── Seed ────────────────────────────────────────────────────────────────────
async function seed() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not set in .env');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  await Internship.deleteMany({});
  await Company.deleteMany({});
  console.log('🗑  Cleared existing data');

  const companies = await Company.insertMany(
    COMPANIES.map((c) => ({
      ...c,
      verified:    true,
      rating:      +(3.5 + Math.random() * 1.5).toFixed(1),
      reviewCount: Math.floor(Math.random() * 200 + 20),
    }))
  );
  console.log(`🏢  Inserted ${companies.length} companies`);

  const internships = TEMPLATES.map((t, i) => ({
    ...t,
    companyId:           companies[i]._id,
    companyWebsite:      companies[i].website,
    startDate:           futureDate(10 + i * 4),
    applicationDeadline: futureDate(5  + i * 3),
    requiredSkills:      [],
    internshipDetailsUrl: '#',
    applicationUrl:       '#',
    status:              'Open',
  }));

  await Internship.insertMany(internships);
  console.log(`📋  Inserted ${internships.length} internships across ${new Set(companies.map(c => c.location)).size} locations`);
  console.log('\nLocation breakdown:');
  const byLoc = {};
  companies.forEach(c => { byLoc[c.location] = (byLoc[c.location] || 0) + 1; });
  Object.entries(byLoc).sort((a, b) => b[1] - a[1]).forEach(([loc, n]) => console.log(`  ${loc}: ${n}`));

  await mongoose.disconnect();
  console.log('\n✅ Seed complete');
}

seed().catch((err) => { console.error('❌ Seed failed:', err.message); process.exit(1); });
