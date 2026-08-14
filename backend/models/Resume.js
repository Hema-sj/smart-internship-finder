import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  fileName: { type: String, required: true, trim: true },
  fileUrl: { type: String, required: true },
  extractedText: { type: String, select: false },
  parsedSkills: [{ type: String, trim: true }],
  score: { type: Number, min: 0, max: 100 },
  isPrimary: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);
