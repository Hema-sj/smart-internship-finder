import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true, lowercase: true },
  category: { type: String, enum: ['programming', 'framework', 'database', 'cloud', 'design', 'soft-skill', 'other'], default: 'other' },
  aliases: [{ type: String, trim: true, lowercase: true }],
  description: { type: String, maxlength: 500 }
}, { timestamps: true });

export default mongoose.model('Skill', skillSchema);
