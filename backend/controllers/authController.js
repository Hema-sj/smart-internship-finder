import User           from '../models/User.js';
import StudentProfile  from '../models/StudentProfile.js';
import Company         from '../models/Company.js';
import { createToken } from '../utils/token.js';

// ─── Helper: cookie + JSON response ──────────────────────────────────────────
async function sendAuth(response, user, extra = {}) {
  const token = createToken(user._id);
  response.cookie('accessToken', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   7 * 24 * 60 * 60 * 1000,
  });
  response.status(200).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    ...extra,
  });
}

// ─── Student registration ──────────────────────────────────────────────────────
export async function register(request, response, next) {
  try {
    const { name, email, password } = request.body;
    if (!name || !email || !password)
      return response.status(400).json({ message: 'Name, email, and password are required.' });
    if (await User.exists({ email: email.toLowerCase() }))
      return response.status(409).json({ message: 'An account with this email already exists.' });

    const user    = await User.create({ name, email, password, role: 'student' });
    const profile = await StudentProfile.create({ userId: user._id });
    sendAuth(response, user, { studentProfile: profile });
  } catch (error) { next(error); }
}

// ─── Company registration ──────────────────────────────────────────────────────
export async function registerCompany(request, response, next) {
  try {
    const { name, email, password, companyName, website, industry, logo } = request.body;
    if (!name || !email || !password || !companyName || !industry)
      return response.status(400).json({ message: 'name, email, password, companyName, and industry are required.' });
    if (await User.exists({ email: email.toLowerCase() }))
      return response.status(409).json({ message: 'An account with this email already exists.' });

    const user    = await User.create({ name, email, password, role: 'company' });
    const company = await Company.create({
      userId:          user._id,
      companyName:     companyName,
      website:         website     || '',
      industry:        industry,
      logo:            logo        || '',
      description:     '',
      verified_status: 'pending', // Requires admin approval
    });
    
    // Do NOT send auth token - company must wait for admin verification
    response.status(201).json({
      message: 'Company registration successful. Your account is pending admin verification.',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      company: { id: company._id, companyName: company.companyName, verified_status: company.verified_status }
    });
  } catch (error) { next(error); }
}

// ─── Login ────────────────────────────────────────────────────────────────────
async function loginAs(request, response, next, role) {
  try {
    const { email, password } = request.body;
    if (!email || !password)
      return response.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return response.status(401).json({ message: 'Email or password is incorrect.' });
    if (user.role !== role)
      return response.status(403).json({ message: `This account does not have ${role} portal access.` });

    let extra = {};
    if (role === 'student') {
      extra.studentProfile = await StudentProfile.findOne({ userId: user._id }).populate('skills', 'name');
    } else if (role === 'company') {
      const company = await Company.findOne({ userId: user._id });
      
      // Reject login if company not yet verified by admin
      if (!company || company.verified_status !== 'approved') {
        return response.status(403).json({ 
          message: 'Your company account is pending admin verification. Please wait for approval.' 
        });
      }
      
      extra.company = company;
    }

    sendAuth(response, user, extra);
  } catch (error) { next(error); }
}

export const login        = (req, res, next) => loginAs(req, res, next, 'student');
export const loginCompany = (req, res, next) => loginAs(req, res, next, 'company');
export const loginAdmin   = (req, res, next) => loginAs(req, res, next, 'admin');

// ─── Get current user ─────────────────────────────────────────────────────────
export async function getCurrentUser(request, response, next) {
  try {
    const user = request.user;
    let extra  = {};
    if (user.role === 'student') {
      extra.studentProfile = await StudentProfile.findOne({ userId: user._id }).populate('skills', 'name');
    } else if (user.role === 'company') {
      extra.company = await Company.findOne({ userId: user._id });
    }
    response.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      ...extra,
    });
  } catch (error) { next(error); }
}

// ─── Logout ───────────────────────────────────────────────────────────────────
export function logout(_request, response) {
  response.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: 'lax',
    secure:   process.env.NODE_ENV === 'production',
  });
  response.status(200).json({ message: 'Logged out successfully.' });
}
