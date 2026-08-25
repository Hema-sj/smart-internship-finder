import sequelize from '../config/database.js';
import User from './User.js';
import Company from './Company.js';
import Internship from './Internship.js';
import StudentProfile from './StudentProfile.js';
import Application from './Application.js';
import SavedInternship from './SavedInternship.js';
import Resume from './Resume.js';
import Notification from './Notification.js';

// Define Associations

// User -> Company (One-to-One)
User.hasOne(Company, { foreignKey: 'userId', as: 'company' });
Company.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User -> StudentProfile (One-to-One)
User.hasOne(StudentProfile, { foreignKey: 'userId', as: 'studentProfile' });
StudentProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Company -> Internships (One-to-Many)
Company.hasMany(Internship, { foreignKey: 'companyId', as: 'internships' });
Internship.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// User -> Applications (One-to-Many)
User.hasMany(Application, { foreignKey: 'studentId', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

// Internship -> Applications (One-to-Many)
Internship.hasMany(Application, { foreignKey: 'internshipId', as: 'applications' });
Application.belongsTo(Internship, { foreignKey: 'internshipId', as: 'internship' });

// User -> SavedInternships (One-to-Many)
User.hasMany(SavedInternship, { foreignKey: 'studentId', as: 'savedInternships' });
SavedInternship.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

// Internship -> SavedInternships (One-to-Many)
Internship.hasMany(SavedInternship, { foreignKey: 'internshipId', as: 'savedBy' });
SavedInternship.belongsTo(Internship, { foreignKey: 'internshipId', as: 'internship' });

// StudentProfile -> Resumes (One-to-Many)
StudentProfile.hasMany(Resume, { foreignKey: 'studentId', as: 'resumes' });
Resume.belongsTo(StudentProfile, { foreignKey: 'studentId', as: 'studentProfile' });

// StudentProfile -> Notifications (One-to-Many)
StudentProfile.hasMany(Notification, { foreignKey: 'studentId', as: 'notifications' });
Notification.belongsTo(StudentProfile, { foreignKey: 'studentId', as: 'studentProfile' });

// Export all models
export {
  sequelize,
  User,
  Company,
  Internship,
  StudentProfile,
  Application,
  SavedInternship,
  Resume,
  Notification,
};

export default {
  sequelize,
  User,
  Company,
  Internship,
  StudentProfile,
  Application,
  SavedInternship,
  Resume,
  Notification,
};
