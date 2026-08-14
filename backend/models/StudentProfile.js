import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  headline: { type: String, trim: true, maxlength: 160 },
  university: { type: String, trim: true },
  degree: { type: String, trim: true },
  branch: { type: String, trim: true },
  graduationYear: { type: Number, min: 2020, max: 2100 },
  preferredLocations: [{ type: String, trim: true }],
  preferredRoles: [{ type: String, trim: true }],
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  links: { github: String, linkedin: String, portfolio: String }
}, { timestamps: true });

export default mongoose.model('StudentProfile', studentProfileSchema);
