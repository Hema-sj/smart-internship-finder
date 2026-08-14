import mongoose from 'mongoose';

const savedInternshipSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  matchPercentage: { type: Number, min: 0, max: 100 },
  skillGaps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }]
}, { timestamps: true });

savedInternshipSchema.index({ student: 1, internship: 1 }, { unique: true });
export default mongoose.model('SavedInternship', savedInternshipSchema);
