import 'dotenv/config';
import { Internship } from '../models/index.js';
import sequelize from '../config/database.js';

async function clearAndReseed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL\n');

    // Delete all internships
    const count = await Internship.destroy({ where: {}, truncate: false });
    console.log(`🗑️  Deleted ${count} existing internships\n`);

    await sequelize.close();
    
    console.log('✅ Ready for re-seeding. Now run: node scripts/seedSampleData.js\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

clearAndReseed();
