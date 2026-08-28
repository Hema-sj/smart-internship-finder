/**
 * Migration routes - for development only
 */
import { Router } from 'express';
import sequelize from '../config/database.js';

const router = Router();

// Add swotAnalysis column to resumes table
router.post('/add-swot-column', async (req, res) => {
  try {
    await sequelize.query(`
      ALTER TABLE resumes 
      ADD COLUMN IF NOT EXISTS "swotAnalysis" JSONB DEFAULT NULL;
    `);
    
    res.json({ 
      success: true, 
      message: 'swotAnalysis column added successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Sync all models (force sync - WARNING: drops tables)
router.post('/sync-force', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    res.json({ 
      success: true, 
      message: 'Database synced with force (all data cleared)' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Sync all models (alter existing tables)
router.post('/sync-alter', async (req, res) => {
  try {
    await sequelize.sync({ alter: true });
    res.json({ 
      success: true, 
      message: 'Database synced with alter (schema updated)' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default router;
