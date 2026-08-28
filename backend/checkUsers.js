import dotenv from 'dotenv';
import sequelize from './config/database.js';
import User from './models/User.js';
import Company from './models/Company.js';

dotenv.config();

const checkDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');
    console.log(`📊 Database: ${process.env.POSTGRES_DB}`);
    console.log(`🌐 Host: ${process.env.POSTGRES_HOST}\n`);

    // Check users
    const users = await User.findAll({
      attributes: ['id', 'email', 'name', 'role', 'createdAt']
    });
    console.log(`👥 Users found: ${users.length}`);
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.role}) - ID: ${user.id}`);
    });

    // Check companies
    const companies = await Company.count();
    console.log(`\n🏢 Companies found: ${companies}`);

    if (users.length === 0) {
      console.log('\n⚠️  No users found! Database needs seeding.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkDatabase();
