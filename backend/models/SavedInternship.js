import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SavedInternship = sequelize.define('SavedInternship', {
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
}, {
  tableName: 'saved_internships',
  timestamps: true,
  indexes: [
    { fields: ['studentId'] },
    { fields: ['internshipId'] },
    { fields: ['studentId', 'internshipId'], unique: true },
  ],
});

export default SavedInternship;
