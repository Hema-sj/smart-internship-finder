import mongoose from 'mongoose';

const savedInternshipSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  savedAt: { type: Date, default: Date.now }
}, { timestamps: false });

savedInternshipSchema.index({ studentId: 1, internshipId: 1 }, { unique: true });
export default mongoose.model('SavedInternship', savedInternshipSchema);
