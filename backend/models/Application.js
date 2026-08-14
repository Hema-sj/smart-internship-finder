import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true, index: true },
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true, index: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  appliedDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'], default: 'Applied', index: true }
}, { timestamps: true });

applicationSchema.index({ studentId: 1, internshipId: 1 }, { unique: true });
export default mongoose.model('Application', applicationSchema);
