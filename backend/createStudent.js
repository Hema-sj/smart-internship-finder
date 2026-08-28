import dotenv from 'dotenv';
import sequelize from './config/database.js';
import { User, StudentProfile } from './models/index.js';

dotenv.config();

const createStudent = async () => {
  try {
    console.log('🌱 Creating test student user...\n');
    
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Check if student already exists
    const existingStudent = await User.findOne({ where: { email: 'student@test.com' } });
    if (existingStudent) {
      console.log('⚠️  Student user already exists, deleting and recreating...');
      await StudentProfile.destroy({ where: { userId: existingStudent.id } });
      await existingStudent.destroy();
    }

    // Create student user (password will be auto-hashed)
    const student = await User.create({
      email: 'student@test.com',
      password: 'Student@123',
      role: 'student',
      name: 'Test Student',
    });
    console.log('✅ Student user created');

    // Create student profile
    const profile = await StudentProfile.create({
      userId: student.id,
      bio: 'Computer Science student looking for internships',
      education: 'B.Tech Computer Science',
      skills: ['JavaScript', 'React', 'Node.js', 'Python'],
      phoneNumber: '9876543210',
      location: 'Chennai, Tamil Nadu',
    });
    console.log('✅ Student profile created');

    console.log('\n🎉 Student account created successfully!');
    console.log('\n📝 Student Login Credentials:');
    console.log('   Email:    student@test.com');
    console.log('   Password: Student@123');
    console.log('\n📝 Admin Login Credentials:');
    console.log('   Email:    admin@smartintern.com');
    console.log('   Password: Admin@2024');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating student:', error);
    process.exit(1);
  }
};

createStudent();
