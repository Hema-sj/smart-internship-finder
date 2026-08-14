import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true, index: true },
  fileName: { type: String, required: true, trim: true },
  filePath: { type: String, required: true, trim: true },
  extractedText: { type: String, select: false },
  extractedSkills: [{ type: String, trim: true }],
  education: [{ institution: { type: String, trim: true }, degree: { type: String, trim: true }, year: Number }],
  projects: [{ title: { type: String, trim: true }, description: { type: String, trim: true }, url: { type: String, trim: true } }],
  certifications: [{ title: { type: String, trim: true }, issuer: { type: String, trim: true } }],
  experience: [{ company: { type: String, trim: true }, role: { type: String, trim: true }, description: { type: String, trim: true } }],
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: false });

export default mongoose.model('Resume', resumeSchema);
