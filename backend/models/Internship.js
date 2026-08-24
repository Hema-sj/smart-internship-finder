import mongoose from 'mongoose';
import { CERTIFICATE_TYPES } from '../constants/certificates.js';

const internshipSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  title: { type: String, required: true, trim: true },
  courseRole: { type: String, required: true, trim: true, index: true },
  startingDate: { type: Date, required: true, index: true },
  applicationDeadline: { type: Date, required: true },
  duration: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true, index: true },
  mode: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], required: true },
  compensationType: { 
    type: String, 
    enum: ['Paid', 'Unpaid', 'Stipend Not Disclosed'], 
    required: true, 
    index: true 
  },
  stipend: { type: Number, min: 0, default: 0 },
  certificateType: {
    type: String,
    enum: ['Hard Copy', 'Soft Copy', 'Both', 'No Certificate', 'Not Disclosed'],
    required: true,
    index: true,
  },
  requiredSkills: [{ type: String, trim: true }],
  description: { type: String, required: true, trim: true },
  companyWebsite: { type: String, trim: true },
  internshipDetailsUrl: { type: String, required: true, trim: true },
  applicationUrl: { type: String, required: true, trim: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Disabled'], 
    default: 'Pending', 
    index: true 
  },
  aiMatch: { type: Number, min: 0, max: 100, default: 0 },
}, { timestamps: true });

// Validation: stipend required only when compensationType is "Paid"
internshipSchema.pre('validate', function(next) {
  if (this.compensationType === 'Paid' && (this.stipend === undefined || this.stipend === null)) {
    return next(new Error('Stipend is required when compensationType is "Paid"'));
  }
  next();
});

// Text search index
internshipSchema.index({ title: 'text', description: 'text', courseRole: 'text' });

// Compound indexes for common queries
internshipSchema.index({ status: 1, startingDate: 1 });
internshipSchema.index({ status: 1, aiMatch: -1, createdAt: -1 });
internshipSchema.index({ companyId: 1, status: 1 });

export default mongoose.model('Internship', internshipSchema);
