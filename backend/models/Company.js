import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true, trim: true, unique: true },
  website: { type: String, trim: true },
  logoUrl: { type: String, trim: true },
  description: { type: String, trim: true, maxlength: 2000 },
  industry: { type: String, trim: true },
  headquarters: { type: String, trim: true },
  size: { type: String, enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'] },
  averageRating: { type: Number, min: 0, max: 5, default: 0 },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Company', companySchema);
