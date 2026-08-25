import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const StudentProfile = sequelize.define('StudentProfile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  college: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  degree: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  graduationYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  resume: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkedin: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  github: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  portfolio: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'student_profiles',
  timestamps: true,
});

export default StudentProfile;
