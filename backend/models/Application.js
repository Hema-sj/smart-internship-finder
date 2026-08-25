import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  internshipId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'internships',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewing', 'shortlisted', 'accepted', 'rejected'),
    defaultValue: 'pending',
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resume: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  appliedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'applications',
  timestamps: true,
  indexes: [
    { fields: ['studentId'] },
    { fields: ['internshipId'] },
    { fields: ['status'] },
    { fields: ['studentId', 'internshipId'], unique: true },
  ],
});

export default Application;
