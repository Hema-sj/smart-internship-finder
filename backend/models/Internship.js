import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Internship = sequelize.define('Internship', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'companies',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  courseRole: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startingDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  applicationDeadline: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mode: {
    type: DataTypes.ENUM('Remote', 'On-site', 'Hybrid'),
    allowNull: false,
  },
  compensationType: {
    type: DataTypes.ENUM('Paid', 'Unpaid', 'Not Disclosed'),
    allowNull: false,
    defaultValue: 'Not Disclosed',
  },
  stipend: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  certificateType: {
    type: DataTypes.ENUM('Hard Copy', 'Soft Copy', 'Both', 'Not Provided', 'Not Disclosed'),
    defaultValue: 'Not Disclosed',
  },
  certificateProvided: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  certificateDetails: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  certificateConditions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  requiredSkills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  companyWebsite: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  internshipDetailsUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  applicationUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  sourceName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sourceUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sourceVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lastVerifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Disabled', 'Closed'),
    defaultValue: 'Pending',
  },
  aiMatch: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
  },
  companyRating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true,
    validate: {
      min: 0,
      max: 5,
    },
  },
  applicationStatus: {
    type: DataTypes.ENUM('Open', 'Closed', 'Applications Full', 'Not Started'),
    defaultValue: 'Open',
  },
}, {
  tableName: 'internships',
  timestamps: true,
  indexes: [
    { fields: ['companyId'] },
    { fields: ['location'] },
    { fields: ['courseRole'] },
    { fields: ['compensationType'] },
    { fields: ['certificateType'] },
    { fields: ['status'] },
    { fields: ['startingDate'] },
  ],
});

export default Internship;
