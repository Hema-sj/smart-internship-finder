import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Resume = sequelize.define('Resume', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'student_profiles',
      key: 'id'
    }
  },
  
  // File metadata
  fileName: DataTypes.STRING,
  filePath: DataTypes.STRING,
  fileSize: DataTypes.INTEGER,
  mimeType: DataTypes.STRING,
  
  // Resume source: 'upload' or 'ai-generated'
  source: {
    type: DataTypes.ENUM('upload', 'ai-generated'),
    defaultValue: 'upload'
  },
  
  // Extracted/Parsed data - stored as TEXT
  extractedText: DataTypes.TEXT,
  
  // Personal information - stored as JSONB
  personalInfo: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  
  // Professional summary/objective
  summary: DataTypes.TEXT,
  
  // Education - stored as JSONB array
  education: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  
  // Skills - stored as array
  extractedSkills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  
  // Projects - stored as JSONB array
  projects: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  
  // Certifications - stored as JSONB array
  certifications: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  
  // Work Experience - stored as JSONB array
  experience: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  
  // Achievements - stored as array
  achievements: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: []
  },
  
  // Interests/Career preferences
  interests: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  preferredRole: DataTypes.STRING,
  preferredLocation: DataTypes.STRING,
  
  // AI analysis metadata
  aiAnalyzed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  aiConfidenceScore: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 100
    }
  },
  
  uploadedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  lastModified: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'resumes',
  timestamps: true,
  hooks: {
    beforeUpdate: (resume) => {
      resume.lastModified = new Date();
    }
  }
});

export default Resume;
