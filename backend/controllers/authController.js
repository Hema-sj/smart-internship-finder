import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import { createToken } from '../utils/token.js';

function sendAuth(response, user, studentProfile = null) {
  const token = createToken(user._id);
  response.cookie('accessToken', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
  response.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role }, studentProfile });
}

async function createAccount(request, response, next, role) {
  try {
    const { name, email, password } = request.body;
    if (!name || !email || !password) return response.status(400).json({ message: 'Name, email, and password are required.' });
    if (await User.exists({ email: email.toLowerCase() })) return response.status(409).json({ message: 'An account with this email already exists.' });
    const user = await User.create({ name, email, password, role });
    const studentProfile = role === 'student' ? await StudentProfile.create({ userId: user._id }) : null;
    sendAuth(response, user, studentProfile);
  } catch (error) { next(error); }
}

async function loginAs(request, response, next, role) {
  try {
    const { email, password } = request.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select('+password');
    if (!user || !password || !(await user.comparePassword(password))) return response.status(401).json({ message: 'Email or password is incorrect.' });
    if (user.role !== role) return response.status(403).json({ message: `This account does not have ${role} portal access.` });
    const studentProfile = user.role === 'student' ? await StudentProfile.findOne({ userId: user._id }) : null;
    sendAuth(response, user, studentProfile);
  } catch (error) { next(error); }
}

export const register = (request, response, next) => createAccount(request, response, next, 'student');
export const registerCompany = (request, response, next) => createAccount(request, response, next, 'company');
export const login = (request, response, next) => loginAs(request, response, next, 'student');
export const loginCompany = (request, response, next) => loginAs(request, response, next, 'company');
export const loginAdmin = (request, response, next) => loginAs(request, response, next, 'admin');

export async function getCurrentUser(request, response, next) {
  try {
    const studentProfile = request.user.role === 'student' ? await StudentProfile.findOne({ userId: request.user._id }) : null;
    response.json({ user: { id: request.user._id, name: request.user.name, email: request.user.email, role: request.user.role }, studentProfile });
  } catch (error) { next(error); }
}

export function logout(_request, response) {
  response.clearCookie('accessToken', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  response.status(200).json({ message: 'Logged out successfully.' });
}
