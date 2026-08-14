import mongoose from 'mongoose';

const learningResourceSchema = new mongoose.Schema({
  skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true, index: true },
  title: { type: String, required: true, trim: true },
  platform: { type: String, trim: true },
  url: { type: String, required: true, trim: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true }
}, { timestamps: true });

export default mongoose.model('LearningResource', learningResourceSchema);
