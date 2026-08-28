/**
 * Migration: Add swotAnalysis column to resumes table
 */
import 'dotenv/config';
import sequelize from '../config/database.js';

async function addSwotColumn() {
  try {
    console.log('🔧 Adding swotAnalysis column to resumes table...\n');
    
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');
    
    // Add the column if it doesn't exist
    await sequelize.query(`
      ALTER TABLE resumes 
      ADD COLUMN IF NOT EXISTS "swotAnalysis" JSONB DEFAULT NULL;
    `);
    
    console.log('✅ swotAnalysis column added successfully!\n');
    
    // Verify the column was added
    const [results] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'resumes' 
      AND column_name = 'swotAnalysis';
    `);
    
    if (results.length > 0) {
      console.log('✅ Verified: Column exists');
      console.log(`   Name: ${results[0].column_name}`);
      console.log(`   Type: ${results[0].data_type}`);
    } else {
      console.log('⚠️  Warning: Column not found after creation');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

addSwotColumn();
