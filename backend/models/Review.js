import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true, maxlength: 2000 }
}, { timestamps: true });

reviewSchema.index({ studentId: 1, companyId: 1 }, { unique: true });
export default mongoose.model('Review', reviewSchema);
