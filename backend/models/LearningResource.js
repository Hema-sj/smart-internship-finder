import mongoose from 'mongoose';

const learningResourceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  provider: { type: String, trim: true },
  url: { type: String, required: true, trim: true },
  description: { type: String, trim: true, maxlength: 1000 },
  type: { type: String, enum: ['course', 'article', 'video', 'project', 'certification'], required: true },
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  isFree: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('LearningResource', learningResourceSchema);
