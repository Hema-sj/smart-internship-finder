/**
 * Test PostgreSQL Connection
 * Run: node scripts/testConnection.js
 */
import 'dotenv/config';
import { Sequelize } from 'sequelize';

console.log('🔄 Testing PostgreSQL connection...\n');

console.log('📋 Connection Details:');
console.log(`   Host: ${process.env.POSTGRES_HOST}`);
console.log(`   Port: ${process.env.POSTGRES_PORT}`);
console.log(`   Database: ${process.env.POSTGRES_DB}`);
console.log(`   User: ${process.env.POSTGRES_USER}`);
console.log(`   Password: ${'*'.repeat(process.env.POSTGRES_PASSWORD?.length || 0)}`);

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    dialect: 'postgres',
    logging: false,
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('\n✅ PostgreSQL connection successful!');
    console.log('✅ Database is ready to use');
    
    // Test query
    const [results] = await sequelize.query('SELECT version()');
    console.log(`\n📊 PostgreSQL Version: ${results[0].version}`);
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error(`   Error: ${error.message}`);
    
    if (error.message.includes('password authentication failed')) {
      console.error('\n💡 Solution: Update POSTGRES_PASSWORD in backend/.env file');
      console.error('   Current password is incorrect for user "postgres"');
    } else if (error.message.includes('does not exist')) {
      console.error('\n💡 Solution: Create the database first');
      console.error('   Run: createdb smart_internship_finder');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Solution: Start PostgreSQL service');
      console.error('   PostgreSQL server is not running');
    }
    
    process.exit(1);
  }
}

testConnection();
