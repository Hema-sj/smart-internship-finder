import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  phone: { type: String, trim: true, match: /^[0-9+()\s-]{7,20}$/ },
  college: { type: String, trim: true, maxlength: 200 },
  degree: { type: String, trim: true, maxlength: 100 },
  branch: { type: String, trim: true, maxlength: 100 },
  year: { type: Number, min: 1, max: 8 },
  cgpa: { type: Number, min: 0, max: 10 },
  location: { type: String, trim: true, index: true },
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  projects: [{ title: { type: String, required: true, trim: true }, description: { type: String, trim: true }, url: { type: String, trim: true } }],
  certifications: [{ title: { type: String, required: true, trim: true }, issuer: { type: String, trim: true }, url: { type: String, trim: true } }],
  interests: [{ type: String, trim: true }],
  dreamCompany: { type: String, trim: true }
}, { timestamps: true });

studentProfileSchema.index({ skills: 1 });

export default mongoose.model('StudentProfile', studentProfileSchema);
