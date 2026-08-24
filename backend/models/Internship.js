import mongoose from 'mongoose';
import { CERTIFICATE_TYPES } from '../constants/certificates.js';

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
  // ── Phase 8: Certificate Information System ──
  certificateProvided: { type: Boolean, default: false },
  certificateType: {
    type: String,
    enum: CERTIFICATE_TYPES,
    default: 'Not Disclosed',
    index: true,
  },
  certificateDetails: { type: String, trim: true, default: '' },
  certificateConditions: { type: String, trim: true, default: '' },
  requiredSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  description: { type: String, required: true, trim: true },
  companyWebsite: { type: String, trim: true },
  internshipDetailsUrl: { type: String, required: true, trim: true },
  applicationUrl: { type: String, required: true, trim: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, min: 0, default: 0 },
  aiMatch: { type: Number, min: 0, max: 100, default: 0 },
  status: { type: String, enum: ['Draft', 'Open', 'Closed'], default: 'Draft', index: true }
}, { timestamps: true });

// ── Phase 8: keep certificate fields consistent ─────────────────────────────
// 1. certificateProvided false → certificateType must be 'Not Provided'
// 2. certificateProvided true  → type must be Hard Copy | Soft Copy | Both
//                                 ('Not Disclosed' allowed when info unavailable)
internshipSchema.pre('validate', function enforceCertificateConsistency(next) {
  const realTypes = ['Hard Copy', 'Soft Copy', 'Both'];
  if (this.certificateProvided === false) {
    if (this.certificateType !== 'Not Disclosed') {
      this.certificateType = 'Not Provided';
    }
  } else if (this.certificateProvided === true) {
    if (!realTypes.includes(this.certificateType) && this.certificateType !== 'Not Disclosed') {
      this.certificateType = 'Not Disclosed';
    }
  } else {
    // Flag not set — derive it from the type so legacy documents keep working
    this.certificateProvided = realTypes.includes(this.certificateType);
  }
  next();
});

internshipSchema.index({ title: 'text', description: 'text', course: 'text' });
internshipSchema.index({ startDate: 1 });
internshipSchema.index({ requiredSkills: 1 });
internshipSchema.index({ aiMatch: -1, createdAt: -1 });
export default mongoose.model('Internship', internshipSchema);
