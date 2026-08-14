import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  title: { type: String, required: true, trim: true },
  course: { type: String, required: true, trim: true, index: true },
  startDate: { type: Date, required: true },
  applicationDeadline: { type: Date, required: true },
  duration: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true, index: true },
  mode: { type: String, enum: ['onsite', 'remote', 'hybrid'], default: 'onsite' },
  compensationType: { type: String, enum: ['Paid', 'Unpaid', 'Stipend Not Disclosed'], required: true, index: true },
  stipend: { type: Number, min: 0, default: 0 },
  certificateType: { type: String, enum: ['Hard Copy', 'Soft Copy', 'Both', 'No Certificate', 'Not Disclosed'], default: 'Not Disclosed' },
  requiredSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  description: { type: String, required: true, trim: true },
  companyWebsite: { type: String, trim: true },
  internshipDetailsUrl: { type: String, required: true, trim: true },
  applicationUrl: { type: String, required: true, trim: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, min: 0, default: 0 },
  status: { type: String, enum: ['Draft', 'Open', 'Closed'], default: 'Draft', index: true }
}, { timestamps: true });

internshipSchema.index({ title: 'text', description: 'text', course: 'text' });
internshipSchema.index({ startDate: 1 });
internshipSchema.index({ requiredSkills: 1 });
export default mongoose.model('Internship', internshipSchema);
