import 'dotenv/config';
import sequelize from '../config/database.js';

async function listTables() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL\n');
    
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('📊 Tables in database:');
    results.forEach((row, index) => {
      console.log(`  ${index + 1}. ${row.table_name}`);
    });
    
    console.log(`\n✅ Total: ${results.length} tables`);
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listTables();
