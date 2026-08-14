import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  logo: { type: String, trim: true },
  description: { type: String, trim: true, maxlength: 2000 },
  website: { type: String, trim: true },
  location: { type: String, trim: true, index: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, min: 0, default: 0 },
  verified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Company', companySchema);
