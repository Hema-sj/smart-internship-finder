import mongoose from 'mongoose';

export default async function connectDatabase() {
  if (!process.env.MONGODB_URI) { console.warn('MONGODB_URI is not configured; starting without a database connection.'); return; }
  try { await mongoose.connect(process.env.MONGODB_URI); console.log('MongoDB connected'); }
  catch (error) { console.warn(`MongoDB unavailable: ${error.message}`); }
}
