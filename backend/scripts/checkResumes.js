import 'dotenv/config';
import Resume from '../models/Resume.js';
import sequelize from '../config/database.js';

async function checkResumes() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL\n');
    
    const resumes = await Resume.findAll({
      attributes: ['id', 'fileName', 'fileSize', 'studentId', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    
    console.log('📄 Recent Resumes:');
    if (resumes.length === 0) {
      console.log('  No resumes found');
    } else {
      resumes.forEach((resume, index) => {
        console.log(`  ${index + 1}. ${resume.fileName}`);
        console.log(`     ID: ${resume.id}`);
        console.log(`     Size: ${Math.round(resume.fileSize / 1024)} KB`);
        console.log(`     Created: ${resume.createdAt}`);
        console.log('');
      });
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkResumes();
