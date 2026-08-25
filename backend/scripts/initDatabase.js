/**
 * Database Initialization Script
 * Creates all tables in PostgreSQL database
 * Run: node scripts/initDatabase.js
 */
import 'dotenv/config';
import { sequelize } from '../models/index.js';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Internship from '../models/Internship.js';
import StudentProfile from '../models/StudentProfile.js';
import Application from '../models/Application.js';
import SavedInternship from '../models/SavedInternship.js';

async function initDatabase() {
  try {
    console.log('🔄 Connecting to PostgreSQL...');
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');

    console.log('\n🔄 Creating tables...');
    
    // Force sync will drop existing tables and recreate them
    // Use { alter: true } to modify existing tables without dropping
    // Use { force: false } to only create tables that don't exist
    await sequelize.sync({ force: true }); // WARNING: This drops all tables!
    
    console.log('✅ All tables created successfully!');
    
    console.log('\n📊 Tables created:');
    console.log('  ✓ users');
    console.log('  ✓ companies');
    console.log('  ✓ internships');
    console.log('  ✓ student_profiles');
    console.log('  ✓ applications');
    console.log('  ✓ saved_internships');
    
    console.log('\n✅ Database initialization complete!');
    console.log('\n📝 You can now view these tables in pgAdmin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

initDatabase();
