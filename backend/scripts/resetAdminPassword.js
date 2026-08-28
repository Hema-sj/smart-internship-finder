/**
 * Reset admin password — sets plain text password and lets the
 * beforeUpdate hook hash it exactly once.
 * Run: node scripts/resetAdminPassword.js
 */
import 'dotenv/config';
import { User } from '../models/index.js';
import sequelize from '../config/database.js';

const ADMIN_EMAIL    = 'admin@smartintern.com';
const ADMIN_PASSWORD = 'Admin@2024';   // plain text — hook will hash it

async function resetAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL\n');

    let admin = await User.findOne({ where: { email: ADMIN_EMAIL } });

    if (!admin) {
      // Create fresh admin user (beforeCreate hook hashes the password)
      admin = await User.create({
        name:     'Admin User',
        email:    ADMIN_EMAIL,
        password: ADMIN_PASSWORD,   // plain text — hook hashes it
        role:     'admin',
      });
      console.log('✨ Created admin user');
    } else {
      // Set plain text — beforeUpdate hook will hash it exactly once
      admin.password = ADMIN_PASSWORD;
      await admin.save();
      console.log('🔄 Admin password reset');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 ADMIN LOGIN CREDENTIALS:');
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

resetAdmin();
