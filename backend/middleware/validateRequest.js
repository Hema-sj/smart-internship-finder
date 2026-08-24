import { body, validationResult } from 'express-validator';

/**
 * Middleware to check validation results and return errors
 */
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  }
  next();
}

/**
 * Company registration validation rules
 */
export const validateCompanyRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('website').optional().trim().isURL().withMessage('Valid URL required'),
  body('industry').trim().notEmpty().withMessage('Industry is required'),
  body('logo').optional().trim(),
];

/**
 * Company profile update validation rules
 */
export const validateCompanyProfile = [
  body('companyName').optional().trim().notEmpty().withMessage('Company name cannot be empty'),
  body('website').optional().trim().isURL().withMessage('Valid URL required'),
  body('industry').optional().trim().notEmpty().withMessage('Industry cannot be empty'),
  body('logo').optional().trim(),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description max 2000 characters'),
];

/**
 * Internship creation/update validation rules
 */
export const validateInternship = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('courseRole').trim().notEmpty().withMessage('Course/Role is required'),
  body('startingDate').isISO8601().withMessage('Valid starting date required'),
  body('applicationDeadline').isISO8601().withMessage('Valid application deadline required'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('mode')
    .isIn(['Remote', 'On-site', 'Hybrid'])
    .withMessage('Mode must be Remote, On-site, or Hybrid'),
  body('compensationType')
    .isIn(['Paid', 'Unpaid', 'Stipend Not Disclosed'])
    .withMessage('Invalid compensation type'),
  body('stipend')
    .optional()
    .isNumeric()
    .withMessage('Stipend must be a number')
    .custom((value, { req }) => {
      if (req.body.compensationType === 'Paid' && (value === undefined || value === null)) {
        throw new Error('Stipend is required when compensationType is Paid');
      }
      return true;
    }),
  body('certificateType')
    .isIn(['Hard Copy', 'Soft Copy', 'Both', 'No Certificate', 'Not Disclosed'])
    .withMessage('Invalid certificate type'),
  body('requiredSkills')
    .optional()
    .isArray()
    .withMessage('Required skills must be an array'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('companyWebsite').optional().trim().isURL().withMessage('Valid URL required'),
  body('internshipDetailsUrl').trim().isURL().withMessage('Valid internship details URL required'),
  body('applicationUrl').trim().isURL().withMessage('Valid application URL required'),
];

/**
 * Application status update validation rules
 */
export const validateApplicationStatus = [
  body('status')
    .isIn(['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'])
    .withMessage('Invalid application status'),
];
