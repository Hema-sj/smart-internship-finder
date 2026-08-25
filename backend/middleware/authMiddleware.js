import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function requireAuth(request, response, next) {
  const token = request.cookies.accessToken || request.headers.authorization?.replace('Bearer ', '');
  if (!token) return response.status(401).json({ message: 'Authentication is required.' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    request.user = await User.findByPk(payload.userId);
    if (!request.user) return response.status(401).json({ message: 'User account was not found.' });
    next();
  } catch { return response.status(401).json({ message: 'Your session is invalid or expired.' }); }
}
