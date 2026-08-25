import 'dotenv/config';
import Resume from '../models/Resume.js';
import sequelize from '../config/database.js';

async function checkResumeSkills() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL\n');
    
    const resumes = await Resume.findAll({
      attributes: ['id', 'fileName', 'source', 'extractedSkills', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    
    console.log('📄 Recent Resumes with Skills:\n');
    if (resumes.length === 0) {
      console.log('  No resumes found');
    } else {
      resumes.forEach((resume, index) => {
        console.log(`${index + 1}. ${resume.fileName || 'AI Generated'}`);
        console.log(`   ID: ${resume.id}`);
        console.log(`   Source: ${resume.source}`);
        console.log(`   Skills: ${resume.extractedSkills ? `[${resume.extractedSkills.join(', ')}]` : 'None'}`);
        console.log(`   Skills Count: ${resume.extractedSkills ? resume.extractedSkills.length : 0}`);
        console.log('');
      });
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkResumeSkills();
