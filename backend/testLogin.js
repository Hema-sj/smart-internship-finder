import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import sequelize from './config/database.js';
import User from './models/User.js';

dotenv.config();

const testLogin = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');

    const email = 'admin@smartintern.com';
    const password = 'Admin@2024';

    console.log('🔍 Testing login...');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}\n`);

    // Find user
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    
    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }

    console.log('✅ User found:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Password hash: ${user.password.substring(0, 30)}...`);

    // Test password comparison
    console.log('\n🔐 Testing password...');
    const isMatch = await user.comparePassword(password);
    
    if (isMatch) {
      console.log('✅ Password matches! Login should work.');
    } else {
      console.log('❌ Password does NOT match!');
      
      // Try direct bcrypt compare
      console.log('\n🔍 Testing direct bcrypt.compare...');
      const directMatch = await bcrypt.compare(password, user.password);
      console.log(`Direct bcrypt result: ${directMatch}`);
      
      // Show what the password hash should be
      console.log('\n🔧 Creating new hash for comparison...');
      const newHash = await bcrypt.hash(password, 10);
      console.log(`New hash: ${newHash.substring(0, 30)}...`);
      const testNewHash = await bcrypt.compare(password, newHash);
      console.log(`New hash test: ${testNewHash ? 'PASS' : 'FAIL'}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testLogin();
