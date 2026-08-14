import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  workMode: { type: String, enum: ['onsite', 'remote', 'hybrid'], default: 'onsite' },
  type: { type: String, enum: ['paid', 'unpaid'], required: true },
  stipend: { amount: { type: Number, min: 0 }, currency: { type: String, default: 'INR' }, period: { type: String, enum: ['month', 'total'], default: 'month' } },
  startDate: Date,
  durationWeeks: { type: Number, min: 1 },
  applicationDeadline: Date,
  applicationUrl: { type: String, required: true, trim: true },
  certificateType: { type: String, enum: ['completion', 'experience', 'none'], default: 'completion' },
  requiredSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  status: { type: String, enum: ['draft', 'open', 'closed'], default: 'draft' }
}, { timestamps: true });

internshipSchema.index({ title: 'text', description: 'text', location: 'text' });
export default mongoose.model('Internship', internshipSchema);
