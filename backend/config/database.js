import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Create Sequelize instance for PostgreSQL
const sequelize = new Sequelize(
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

// Test database connection
export async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');
    
    // Sync all models (create tables if they don't exist)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: false }); // Set to true to auto-update schema
      console.log('✅ Database models synchronized');
    }
    
    return sequelize;
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL:', error.message);
    process.exit(1);
  }
}

export default sequelize;
