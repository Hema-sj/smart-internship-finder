import 'dotenv/config';
import mongoose from 'mongoose';
import Internship from '../models/Internship.js';

await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected');

// Test listInternships equivalent
try {
  const items = await Internship.find({ status: 'Open' })
    .populate('companyId', 'name logo rating reviewCount verified')
    .populate('requiredSkills', 'name')
    .sort({ aiMatch: -1 })
    .limit(3);
  console.log('listInternships OK:', items.length, 'items');
  console.log('Sample:', JSON.stringify(items[0]?.title));
} catch(e) { console.error('listInternships FAIL:', e.message); }

// Test locations aggregate
try {
  const stats = await Internship.aggregate([
    { $match: { status: 'Open' } },
    { $group: { _id: '$location', total: { $sum: 1 }, paid: { $sum: { $cond: [{ $eq: ['$compensationType', 'Paid'] }, 1, 0] } }, unpaid: { $sum: { $cond: [{ $eq: ['$compensationType', 'Unpaid'] }, 1, 0] } } } },
    { $sort: { total: -1 } },
    { $project: { _id: 0, location: '$_id', total: 1, paid: 1, unpaid: 1 } },
  ]);
  console.log('listLocations OK:', stats);
} catch(e) { console.error('listLocations FAIL:', e.message); }

await mongoose.disconnect();
