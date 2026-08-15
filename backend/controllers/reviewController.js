/**
 * Review controller.
 * Students submit reviews for companies they have worked with (status = Selected).
 * Anyone can read reviews. Admins can delete any review.
 */
import Review          from '../models/Review.js';
import Application     from '../models/Application.js';
import Company         from '../models/Company.js';
import StudentProfile  from '../models/StudentProfile.js';

// GET /api/reviews?companyId=xxx  — public
export async function getReviews(request, response, next) {
  try {
    const { companyId, page = 1, limit = 10 } = request.query;
    if (!companyId) return response.status(400).json({ message: 'companyId query param is required.' });

    const p = Math.max(parseInt(page, 10), 1);
    const l = Math.min(parseInt(limit, 10), 50);

    const [reviews, total] = await Promise.all([
      Review.find({ companyId })
        .populate({ path: 'studentId', populate: { path: 'userId', select: 'name' } })
        .sort({ createdAt: -1 })
        .skip((p - 1) * l)
        .limit(l),
      Review.countDocuments({ companyId }),
    ]);
    response.json({ reviews, pagination: { page: p, limit: l, total, pages: Math.ceil(total / l) } });
  } catch (error) { next(error); }
}

// POST /api/reviews — student only, must have a Selected application for the company
export async function createReview(request, response, next) {
  try {
    const { companyId, rating, comment } = request.body;
    if (!companyId || !rating || !comment) {
      return response.status(400).json({ message: 'companyId, rating, and comment are required.' });
    }

    const profile = await StudentProfile.findOne({ userId: request.user._id });
    if (!profile) return response.status(404).json({ message: 'Student profile not found.' });

    // Only allow reviews from students with a Selected application to this company
    const eligibleApplication = await Application.findOne({
      studentId: profile._id,
      companyId,
      status:    { $in: ['Selected', 'Interview', 'Shortlisted'] },
    });
    if (!eligibleApplication) {
      return response.status(403).json({
        message: 'You can only review companies where you have been shortlisted or selected.',
      });
    }

    const existing = await Review.findOne({ studentId: profile._id, companyId });
    if (existing) return response.status(409).json({ message: 'You have already reviewed this company.' });

    const review = await Review.create({ studentId: profile._id, companyId, rating, comment });

    // Update company aggregated rating
    const stats = await Review.aggregate([
      { $match: { companyId: review.companyId } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (stats.length) {
      await Company.findByIdAndUpdate(companyId, {
        rating:      Math.round(stats[0].avg * 10) / 10,
        reviewCount: stats[0].count,
      });
    }

    response.status(201).json(review);
  } catch (error) { next(error); }
}

// DELETE /api/reviews/:id — review owner (student) or admin
export async function deleteReview(request, response, next) {
  try {
    const review = await Review.findById(request.params.id);
    if (!review) return response.status(404).json({ message: 'Review not found.' });

    if (request.user.role !== 'admin') {
      const profile = await StudentProfile.findOne({ userId: request.user._id });
      if (!profile || review.studentId.toString() !== profile._id.toString()) {
        return response.status(403).json({ message: 'You can only delete your own reviews.' });
      }
    }

    await review.deleteOne();

    // Recalculate company rating
    const stats = await Review.aggregate([
      { $match: { companyId: review.companyId } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    await Company.findByIdAndUpdate(review.companyId, {
      rating:      stats.length ? Math.round(stats[0].avg * 10) / 10 : 0,
      reviewCount: stats.length ? stats[0].count : 0,
    });

    response.json({ message: 'Review deleted.' });
  } catch (error) { next(error); }
}
