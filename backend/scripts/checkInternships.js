import 'dotenv/config';
import Internship from '../models/Internship.js';
import sequelize from '../config/database.js';

async function checkInternships() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL\n');
    
    const internships = await Internship.findAll({
      limit: 10
    });
    
    const total = await Internship.count();
    
    console.log(`📊 Total Internships: ${total}\n`);
    
    if (internships.length === 0) {
      console.log('❌ No internships found in the database');
      console.log('\n💡 You need to seed the database with internship data');
      console.log('   Run: node scripts/seedInternships.js');
    } else {
      console.log('📄 Recent Internships:\n');
      internships.forEach((internship, index) => {
        console.log(`${index + 1}. ${internship.title}`);
        console.log(`   Location: ${internship.location}`);
        console.log(`   Status: ${internship.status}`);
        console.log('');
      });
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkInternships();
