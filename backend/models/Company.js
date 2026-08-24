import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  // Link to the User account that owns this company profile
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, sparse: true },
  companyName:     { type: String, required: true, trim: true, unique: true },
  logo:            { type: String, trim: true },
  description:     { type: String, trim: true, maxlength: 2000 },
  website:         { type: String, trim: true },
  industry:        { type: String, trim: true, required: true },
  verified_status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
}, { 
  timestamps: true,
  toJSON: { 
    transform: (doc, ret) => {
      delete ret.__v;
      return ret;
    }
  }
});

// Never return password in any query
companySchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('Company', companySchema);
