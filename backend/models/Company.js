import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  // Link to the User account that owns this company profile
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, sparse: true },
  name:        { type: String, required: true, trim: true, unique: true },
  logo:        { type: String, trim: true },
  description: { type: String, trim: true, maxlength: 2000 },
  website:     { type: String, trim: true },
  location:    { type: String, trim: true, index: true },
  industry:    { type: String, trim: true },
  size:        { type: String, enum: ['1-10', '11-50', '51-200', '201-500', '500+'], default: '51-200' },
  founded:     { type: Number },
  rating:      { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, min: 0, default: 0 },
  verified:    { type: Boolean, default: false, index: true },
}, { timestamps: true });

export default mongoose.model('Company', companySchema);
