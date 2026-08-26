import 'dotenv/config';
import sequelize from '../config/database.js';
import { User, StudentProfile } from '../models/index.js';

async function createTestUser() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL\n');

    // Check if test user exists
    const existingUser = await User.findOne({ where: { email: 'student@test.com' } });
    
    if (existingUser) {
      console.log('✅ Test user already exists!');
      console.log('\n📧 Email: student@test.com');
      console.log('🔑 Password: Test123456\n');
      await sequelize.close();
      return;
    }

    // Create test student user
    const user = await User.create({
      name: 'Test Student',
      email: 'student@test.com',
      password: 'Test123456',
      role: 'student'
    });

    // Create student profile
    await StudentProfile.create({
      userId: user.id
    });

    console.log('✅ Test user created successfully!\n');
    console.log('═══════════════════════════════════');
    console.log('📧 Email: student@test.com');
    console.log('🔑 Password: Test123456');
    console.log('═══════════════════════════════════\n');

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestUser();
