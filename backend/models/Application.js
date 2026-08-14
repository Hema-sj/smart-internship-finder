import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  status: { type: String, enum: ['saved', 'applied', 'shortlisted', 'interviewing', 'offered', 'rejected', 'withdrawn'], default: 'applied' },
  appliedAt: { type: Date, default: Date.now },
  notes: { type: String, maxlength: 1000 }
}, { timestamps: true });

applicationSchema.index({ student: 1, internship: 1 }, { unique: true });
export default mongoose.model('Application', applicationSchema);
