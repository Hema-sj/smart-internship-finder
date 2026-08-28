/**
 * Create test users: Admin and Student
 * Run: node scripts/createTestUsers.js
 */
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { User, StudentProfile } from '../models/index.js';
import sequelize from '../config/database.js';

async function createTestUsers() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL');

    // Admin User
    const adminEmail = 'admin@smartintern.com';
    const adminPassword = 'Admin@2024';
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    const [admin, adminCreated] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        email: adminEmail,
        password: hashedAdminPassword,
        role: 'admin',
        name: 'Admin User',
        isVerified: true,
      }
    });

    if (adminCreated) {
      console.log('✨ Created Admin User:');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    } else {
      console.log('ℹ️  Admin user already exists');
      // Update password
      admin.password = hashedAdminPassword;
      await admin.save();
      console.log('🔄 Updated admin password');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    }

    // Student User
    const studentEmail = 'student@smartintern.com';
    const studentPassword = 'Student@2024';
    const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);

    const [student, studentCreated] = await User.findOrCreate({
      where: { email: studentEmail },
      defaults: {
        email: studentEmail,
        password: hashedStudentPassword,
        role: 'student',
        name: 'Test Student',
        isVerified: true,
      }
    });

    if (studentCreated) {
      console.log('✨ Created Student User:');
      console.log(`   Email: ${studentEmail}`);
      console.log(`   Password: ${studentPassword}`);
      
      // Create student profile
      await StudentProfile.create({
        userId: student.id,
        bio: 'Test student account for Smart Internship Finder',
        education: 'Computer Science',
        skills: ['JavaScript', 'React', 'Node.js', 'Python'],
        location: 'Chennai',
        phone: '+91 9876543210',
      });
      console.log('   ✅ Student profile created');
    } else {
      console.log('ℹ️  Student user already exists');
      // Update password
      student.password = hashedStudentPassword;
      await student.save();
      console.log('🔄 Updated student password');
      console.log(`   Email: ${studentEmail}`);
      console.log(`   Password: ${studentPassword}`);
      
      // Check if profile exists
      const profile = await StudentProfile.findOne({ where: { userId: student.id } });
      if (!profile) {
        await StudentProfile.create({
          userId: student.id,
          bio: 'Test student account for Smart Internship Finder',
          education: 'Computer Science',
          skills: ['JavaScript', 'React', 'Node.js', 'Python'],
          location: 'Chennai',
          phone: '+91 9876543210',
        });
        console.log('   ✅ Student profile created');
      }
    }

    console.log('\n📋 Summary:');
    console.log('━'.repeat(50));
    console.log('🔐 ADMIN LOGIN:');
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('');
    console.log('👨‍🎓 STUDENT LOGIN:');
    console.log(`   Email:    ${studentEmail}`);
    console.log(`   Password: ${studentPassword}`);
    console.log('━'.repeat(50));
    console.log('\n✅ Test users ready! Login at: http://localhost:5173/login');

  } catch (error) {
    console.error('❌ Error creating users:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

createTestUsers();
