/**
 * Role-based authorization middleware.
 *
 * Usage:
 *   router.get('/admin/users', requireAuth, requireRole('admin'), handler)
 *   router.get('/me', requireAuth, requireRole('student', 'admin'), handler)
 */
export function requireRole(...roles) {
  return (request, response, next) => {
    if (!request.user) {
      return response.status(401).json({ message: 'Authentication is required.' });
    }
    if (!roles.includes(request.user.role)) {
      return response.status(403).json({
        message: `Access denied. Required role: ${roles.join(' or ')}.`,
      });
    }
    next();
  };
}

/**
 * Ownership guard — verifies the authenticated user owns the Mongoose document.
 *
 * @param {import('mongoose').Model} Model  - Mongoose model to query
 * @param {string} ownerField              - Field on document that holds owner's User _id
 *
 * Sets request.ownedDoc so controllers don't re-query.
 */
export function requireOwnership(Model, ownerField = 'userId') {
  return async (request, response, next) => {
    try {
      const doc = await Model.findById(request.params.id);
      if (!doc) return response.status(404).json({ message: 'Resource not found.' });

      const ownerId = doc[ownerField]?.toString();
      const userId  = request.user._id.toString();

      if (request.user.role === 'admin' || ownerId === userId) {
        request.ownedDoc = doc;
        return next();
      }
      return response.status(403).json({ message: 'You do not have permission to access this resource.' });
    } catch (error) {
      next(error);
    }
  };
}
