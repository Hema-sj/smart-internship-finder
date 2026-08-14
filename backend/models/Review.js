import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, trim: true, maxlength: 160 },
  comment: { type: String, required: true, trim: true, maxlength: 2000 },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

reviewSchema.index({ author: 1, company: 1, internship: 1 }, { unique: true });
export default mongoose.model('Review', reviewSchema);
