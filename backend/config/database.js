import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Check if DATABASE_URL is provided (for Neon, Railway, etc.)
const databaseUrl = process.env.DATABASE_URL;

let sequelize;

if (databaseUrl) {
  // Use DATABASE_URL (includes all connection info)
  console.log('Using DATABASE_URL for connection');
  
  // Check if it's a cloud database (needs SSL)
  const isCloudDB = databaseUrl.includes('neon.tech') || 
                    databaseUrl.includes('railway') || 
                    databaseUrl.includes('supabase');
  
  const config = {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 2,
      acquire: 60000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: false,
    },
  };
  
  // Only add SSL for cloud databases
  if (isCloudDB) {
    console.log('⚙️  SSL enabled for cloud database');
    config.dialectOptions = {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    };
  } else {
    console.log('⚙️  SSL disabled for local database');
  }
  
  sequelize = new Sequelize(databaseUrl, config);
} else {
  // Use individual env variables (local development)
  console.log('Using individual DB env variables');
  sequelize = new Sequelize(
    process.env.POSTGRES_DB || 'smart_internship_finder',
    process.env.POSTGRES_USER || 'postgres',
    process.env.POSTGRES_PASSWORD || 'postgres',
    {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT) || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      define: {
        timestamps: true,
        underscored: false,
        freezeTableName: false,
      },
    }
  );
}

// Test database connection
export async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');
    console.log(`📊 Database: ${process.env.POSTGRES_DB || 'from DATABASE_URL'}`);
    console.log(`🌐 Host: ${process.env.POSTGRES_HOST || 'from DATABASE_URL'}`);
    
    // Sync all models (create tables if they don't exist)
    await sequelize.sync({ alter: false });
    console.log('✅ Database models synchronized');
    
    return sequelize;
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
}

export default sequelize;
