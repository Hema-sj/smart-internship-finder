import 'dotenv/config';
import mongoose from 'mongoose';

async function dropOldIndexes() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');
  
  try {
    await mongoose.connection.db.collection('companies').dropIndex('name_1');
    console.log('✅ Dropped name_1 index from companies');
  } catch (err) {
    console.log('ℹ️  name_1 index not found (already dropped or never existed)');
  }
  
  await mongoose.disconnect();
  console.log('✅ Done');
}

dropOldIndexes().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
