/**
 * Phase 8 migration — backfills certificate fields on existing internships.
 *
 * Rules:
 *   - Legacy 'No Certificate'  → certificateType 'Not Provided', provided = false
 *   - Hard Copy / Soft Copy / Both → provided = true
 *   - Missing / null / unknown     → certificateType 'Not Disclosed', provided = false
 *   - certificateDetails / certificateConditions default to ''
 *
 * Idempotent — safe to run multiple times.
 * Run from the backend directory: node scripts/migrateCertificateFields.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import Internship from '../models/Internship.js';

const REAL_TYPES = ['Hard Copy', 'Soft Copy', 'Both'];

async function migrate() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not set in .env');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const internships = await Internship.find({}).lean();
  console.log(`📋 Found ${internships.length} internships`);

  let updated = 0;
  const bulkOps = [];

  for (const doc of internships) {
    const legacy = doc.certificateType;
    let certificateType;
    let certificateProvided;

    if (legacy === 'No Certificate') {
      certificateType = 'Not Provided';
      certificateProvided = false;
    } else if (REAL_TYPES.includes(legacy)) {
      certificateType = legacy;
      certificateProvided = true;
    } else {
      // undefined, null, or anything unrecognised
      certificateType = 'Not Disclosed';
      certificateProvided = false;
    }

    const needsUpdate =
      legacy !== certificateType ||
      doc.certificateProvided !== certificateProvided ||
      doc.certificateDetails === undefined ||
      doc.certificateConditions === undefined;

    if (!needsUpdate) continue;

    bulkOps.push({
      updateOne: {
        filter: { _id: doc._id },
        update: {
          $set: {
            certificateType,
            certificateProvided,
            certificateDetails: doc.certificateDetails ?? '',
            certificateConditions: doc.certificateConditions ?? '',
          },
        },
      },
    });
    updated += 1;
  }

  if (bulkOps.length) {
    await Internship.bulkWrite(bulkOps, { ordered: false });
  }
  console.log(`🔄 Updated ${updated} internship(s) with certificate information`);

  // Summary
  const summary = await Internship.aggregate([
    { $group: { _id: '$certificateType', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  console.log('\nCertificate breakdown:');
  summary.forEach(({ _id, count }) => console.log(`  ${_id}: ${count}`));

  await mongoose.disconnect();
  console.log('\n✅ Migration complete');
}

migrate().catch((err) => { console.error('❌ Migration failed:', err.message); process.exit(1); });
