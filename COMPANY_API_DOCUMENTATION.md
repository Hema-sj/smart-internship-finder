# Company Portal API Documentation

Complete API reference for the Smart Internship Finder Company Portal backend implementation.

## Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication

All company endpoints require JWT authentication via HTTP-only cookie or Authorization header.

### Register Company

**POST** `/auth/company/register`

Register a new company account (requires admin verification before login).

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "password": "securepassword123",
  "companyName": "Tech Corp",
  "website": "https://techcorp.com",
  "industry": "Technology",
  "logo": "https://example.com/logo.png"
}
```

**Validation Rules:**
- `name`: Required, non-empty string
- `email`: Required, valid email format
- `password`: Required, minimum 8 characters
- `companyName`: Required, non-empty string
- `website`: Optional, must be valid URL if provided
- `industry`: Required, non-empty string
- `logo`: Optional, string (URL)

**Success Response (201):**
```json
{
  "message": "Company registration successful. Your account is pending admin verification.",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@company.com",
    "role": "company"
  },
  "company": {
    "id": "company_id",
    "companyName": "Tech Corp",
    "verified_status": "pending"
  }
}
```

**Error Responses:**
- `400`: Validation errors (missing fields, invalid email, etc.)
- `409`: Email already exists

**Security Features:**
- Password hashed with bcrypt (salt rounds: 12)
- Company starts with `verified_status: "pending"`
- Cannot login until admin approves

---

### Login Company

**POST** `/auth/company/login`

Login to company portal (only works if company is approved).

**Request Body:**
```json
{
  "email": "john@company.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@company.com",
    "role": "company"
  },
  "company": {
    "_id": "company_id",
    "companyName": "Tech Corp",
    "website": "https://techcorp.com",
    "industry": "Technology",
    "verified_status": "approved",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Invalid email or password
- `403`: Account pending verification or role mismatch

**Rate Limiting:**
- Max 5 attempts per 15 minutes
- Returns `429` when limit exceeded

---

## 👤 Company Profile

### Get My Profile

**GET** `/company/profile`

Retrieve the authenticated company's profile.

**Headers:**
```
Cookie: accessToken=jwt_token
```

**Success Response (200):**
```json
{
  "_id": "company_id",
  "userId": "user_id",
  "companyName": "Tech Corp",
  "logo": "https://example.com/logo.png",
  "description": "We build amazing software",
  "website": "https://techcorp.com",
  "industry": "Technology",
  "verified_status": "approved",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `401`: Not authenticated
- `403`: Not a company account
- `404`: Company profile not found

---

### Update My Profile

**PUT** `/company/profile`

Update the authenticated company's profile.

**Headers:**
```
Cookie: accessToken=jwt_token
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "companyName": "Tech Corp International",
  "website": "https://techcorp.com",
  "industry": "Software Development",
  "logo": "https://newlogo.com/logo.png",
  "description": "Leading tech company specializing in AI solutions"
}
```

**Validation Rules:**
- `companyName`: Non-empty if provided
- `website`: Valid URL if provided
- `industry`: Non-empty if provided
- `description`: Max 2000 characters

**Success Response (200):**
```json
{
  "_id": "company_id",
  "companyName": "Tech Corp International",
  "website": "https://techcorp.com",
  "industry": "Software Development",
  "logo": "https://newlogo.com/logo.png",
  "description": "Leading tech company specializing in AI solutions",
  "verified_status": "approved",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

**Error Responses:**
- `400`: Validation errors
- `401`: Not authenticated
- `403`: Not a company account
- `404`: Profile not found

---

## 💼 Internship Management

### Get My Internships

**GET** `/company/internships`

List all internships created by this company.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 50)
- `status` (optional): Filter by status (Pending|Approved|Rejected|Disabled)

**Example:**
```
GET /company/internships?page=1&limit=10&status=Approved
```

**Success Response (200):**
```json
{
  "data": [
    {
      "_id": "internship_id",
      "title": "Software Engineering Intern",
      "courseRole": "Backend Development",
      "startingDate": "2024-06-01T00:00:00.000Z",
      "applicationDeadline": "2024-05-15T00:00:00.000Z",
      "duration": "3 months",
      "location": "Bangalore",
      "mode": "On-site",
      "compensationType": "Paid",
      "stipend": 25000,
      "certificateType": "Soft Copy",
      "requiredSkills": ["Python", "Django", "REST APIs"],
      "description": "Work on backend systems...",
      "companyWebsite": "https://techcorp.com",
      "internshipDetailsUrl": "https://techcorp.com/careers/intern-1",
      "applicationUrl": "https://apply.techcorp.com/intern-1",
      "status": "Approved",
      "aiMatch": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalCount": 15,
  "totalPages": 2,
  "currentPage": 1
}
```

---

### Get Internship By ID

**GET** `/company/internships/:id`

Get a single internship owned by this company.

**Success Response (200):**
```json
{
  "_id": "internship_id",
  "title": "Software Engineering Intern",
  "courseRole": "Backend Development",
  ... (same structure as list)
}
```

**Error Responses:**
- `404`: Internship not found or not owned by this company

---

### Create Internship

**POST** `/company/internships`

Create a new internship (requires company to be verified/approved).

**Request Body:**
```json
{
  "title": "Software Engineering Intern",
  "courseRole": "Backend Development",
  "startingDate": "2024-06-01",
  "applicationDeadline": "2024-05-15",
  "duration": "3 months",
  "location": "Bangalore",
  "mode": "On-site",
  "compensationType": "Paid",
  "stipend": 25000,
  "certificateType": "Soft Copy",
  "requiredSkills": ["Python", "Django", "REST APIs"],
  "description": "Work on backend systems and contribute to core product development.",
  "companyWebsite": "https://techcorp.com",
  "internshipDetailsUrl": "https://techcorp.com/careers/intern-1",
  "applicationUrl": "https://apply.techcorp.com/intern-1"
}
```

**Validation Rules:**
- `title`: Required, non-empty
- `courseRole`: Required, non-empty
- `startingDate`: Required, valid ISO8601 date
- `applicationDeadline`: Required, valid ISO8601 date
- `duration`: Required, non-empty string
- `location`: Required, non-empty
- `mode`: Required, enum: "Remote" | "On-site" | "Hybrid"
- `compensationType`: Required, enum: "Paid" | "Unpaid" | "Stipend Not Disclosed"
- `stipend`: Required if compensationType is "Paid", must be numeric
- `certificateType`: Required, enum: "Hard Copy" | "Soft Copy" | "Both" | "No Certificate" | "Not Disclosed"
- `requiredSkills`: Optional array of strings
- `description`: Required, non-empty
- `companyWebsite`: Optional, valid URL if provided
- `internshipDetailsUrl`: Required, valid URL
- `applicationUrl`: Required, valid URL

**Success Response (201):**
```json
{
  "_id": "new_internship_id",
  "companyId": "company_id",
  "title": "Software Engineering Intern",
  "courseRole": "Backend Development",
  ... (all fields),
  "status": "Pending",
  "aiMatch": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `400`: Validation errors
- `403`: Company not verified by admin
- `404`: Company profile not found

**Notes:**
- Internship always starts with `status: "Pending"` (requires admin approval)
- Only verified companies can create internships

---

### Update Internship

**PUT** `/company/internships/:id`

Update an existing internship owned by this company.

**Request Body:** Same as Create Internship (all fields optional for update)

**Success Response (200):**
```json
{
  "_id": "internship_id",
  "title": "Updated Title",
  ... (updated fields),
  "status": "Pending",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

**Error Responses:**
- `400`: Validation errors
- `404`: Internship not found or not owned by this company

**Important Behavior:**
- If internship was "Approved" and is edited, status resets to "Pending" for re-review

---

### Delete Internship

**DELETE** `/company/internships/:id`

Delete an internship owned by this company.

**Success Response (200):**
```json
{
  "message": "Internship deleted successfully."
}
```

**Error Responses:**
- `404`: Internship not found or not owned by this company

---

### Disable Internship

**PATCH** `/company/internships/:id/disable`

Set internship status to "Disabled" (hides from public listings).

**Success Response (200):**
```json
{
  "_id": "internship_id",
  ... (all fields),
  "status": "Disabled",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

**Error Responses:**
- `404`: Internship not found or not owned by this company

---

## 📝 Application Management

### Get Applications

**GET** `/company/applications`

List all applications for internships owned by this company.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 50)
- `internshipId` (optional): Filter by specific internship
- `status` (optional): Filter by status

**Example:**
```
GET /company/applications?internshipId=abc123&status=Shortlisted&page=1&limit=20
```

**Success Response (200):**
```json
{
  "data": [
    {
      "_id": "application_id",
      "studentId": {
        "_id": "student_profile_id",
        "userId": {
          "_id": "user_id",
          "name": "Jane Smith",
          "email": "jane@example.com"
        }
      },
      "internshipId": {
        "_id": "internship_id",
        "title": "Software Engineering Intern",
        "courseRole": "Backend Development",
        "location": "Bangalore"
      },
      "companyId": "company_id",
      "status": "Shortlisted",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  ],
  "totalCount": 45,
  "totalPages": 3,
  "currentPage": 1
}
```

---

### Update Application Status

**PUT** `/company/applications/:id/status`

Update the status of an application.

**Request Body:**
```json
{
  "status": "Shortlisted"
}
```

**Validation:**
- `status`: Required, enum: "Applied" | "Under Review" | "Shortlisted" | "Interview" | "Selected" | "Rejected"

**Success Response (200):**
```json
{
  "_id": "application_id",
  "studentId": "student_profile_id",
  "internshipId": "internship_id",
  "companyId": "company_id",
  "status": "Shortlisted",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

**Error Responses:**
- `400`: Invalid status value
- `404`: Application not found or does not belong to this company

**Security:**
- Ownership check: Application must belong to an internship owned by this company

---

## 📊 Dashboard Stats

### Get Dashboard Stats

**GET** `/company/dashboard/stats`

Get statistics for the company dashboard.

**Success Response (200):**
```json
{
  "totalInternships": 15,
  "activeInternships": 8,
  "pendingInternships": 3,
  "totalApplications": 127,
  "applicationsByStatus": {
    "Applied": 45,
    "Under Review": 32,
    "Shortlisted": 23,
    "Interview": 12,
    "Selected": 8,
    "Rejected": 7
  }
}
```

**Field Definitions:**
- `totalInternships`: All internships created by this company
- `activeInternships`: Approved internships with deadline >= today
- `pendingInternships`: Internships awaiting admin approval
- `totalApplications`: Total applications across all internships
- `applicationsByStatus`: Count of applications grouped by status

---

## 🌐 Public Internship APIs (Student-Facing)

### Search Internships

**GET** `/internships`

Public endpoint to search approved internships.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 50)
- `keyword`: Search in title, courseRole, requiredSkills, companyName
- `course`: Filter by courseRole (partial match)
- `location`: Filter by location (partial match)
- `compensationType`: Filter by exact compensation type
- `certificateType`: Filter by exact certificate type
- `startDateFrom`: Filter startingDate >= this date (ISO8601)
- `startDateTo`: Filter startingDate <= this date (ISO8601)
- `sortBy`: Sort order
  - `newest` (default): Recently posted
  - `bestMatch`: Match score (requires student authentication)
  - `startingSoon`: Earliest start date first
  - `highestStipend`: Highest stipend first

**Example:**
```
GET /internships?keyword=python&location=Bangalore&compensationType=Paid&sortBy=highestStipend&page=1&limit=10
```

**Success Response (200):**
```json
{
  "data": [
    {
      "_id": "internship_id",
      "companyId": {
        "_id": "company_id",
        "companyName": "Tech Corp",
        "logo": "https://logo.png"
      },
      "title": "Software Engineering Intern",
      "courseRole": "Backend Development",
      "startingDate": "2024-06-01T00:00:00.000Z",
      "location": "Bangalore",
      "mode": "On-site",
      "compensationType": "Paid",
      "stipend": 25000,
      "certificateType": "Soft Copy",
      "matchScore": 85,
      "companyName": "Tech Corp",
      "internshipId": "internship_id",
      ... (other fields)
    }
  ],
  "totalCount": 142,
  "totalPages": 15,
  "currentPage": 1
}
```

**Notes:**
- Only returns internships with `status: "Approved"`
- `matchScore` only calculated if student is authenticated
- For unauthenticated users, `matchScore` is `null`

---

### Get Internship Details

**GET** `/internships/:id`

Get full details of a single internship.

**Success Response (200):**
```json
{
  "_id": "internship_id",
  "companyId": {
    "_id": "company_id",
    "companyName": "Tech Corp",
    "logo": "https://logo.png",
    "website": "https://techcorp.com",
    "industry": "Technology",
    "description": "Leading tech company..."
  },
  "title": "Software Engineering Intern",
  "courseRole": "Backend Development",
  "startingDate": "2024-06-01T00:00:00.000Z",
  "applicationDeadline": "2024-05-15T00:00:00.000Z",
  "duration": "3 months",
  "location": "Bangalore",
  "mode": "On-site",
  "compensationType": "Paid",
  "stipend": 25000,
  "certificateType": "Soft Copy",
  "requiredSkills": ["Python", "Django", "REST APIs"],
  "description": "Work on backend systems...",
  "companyWebsite": "https://techcorp.com",
  "internshipDetailsUrl": "https://techcorp.com/careers/intern-1",
  "applicationUrl": "https://apply.techcorp.com/intern-1",
  "status": "Approved",
  "matchScore": 85,
  "companyName": "Tech Corp",
  "internshipId": "internship_id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `404`: Internship not found or not approved (unless requester is owner or admin)

**Access Rules:**
- Public users: Only see "Approved" internships
- Company owners: See their own internships (any status)
- Admins: See all internships (any status)

---

## 🔒 Security Features

### Authentication
- JWT tokens in HTTP-only cookies
- 7-day token expiration
- Secure flag enabled in production
- SameSite: lax

### Authorization
- Role-based access control (company role required)
- Ownership validation on all company-scoped operations
- Companies cannot access other companies' data

### Validation
- express-validator on all POST/PUT requests
- Mongoose schema validation
- Custom business logic validation

### Rate Limiting
- 5 login attempts per 15 minutes per IP
- Applies to all auth endpoints

### Error Handling
- Centralized error middleware
- No stack traces leaked in production
- Consistent JSON error format

### CORS
- Restricted to configured origins
- Credentials supported

---

## 📝 Testing

### Install Dependencies
```bash
cd backend
npm install
```

### Run Test Script
```bash
node scripts/testCompanyAPIs.js
```

### Manual Testing with curl

**Register Company:**
```bash
curl -X POST http://localhost:5000/api/auth/company/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@techcorp.com",
    "password": "password123",
    "companyName": "Tech Corp",
    "website": "https://techcorp.com",
    "industry": "Technology"
  }'
```

**Login (after admin approval):**
```bash
curl -X POST http://localhost:5000/api/auth/company/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@techcorp.com",
    "password": "password123"
  }'
```

**Get Profile:**
```bash
curl -X GET http://localhost:5000/api/company/profile \
  -b cookies.txt
```

**Create Internship:**
```bash
curl -X POST http://localhost:5000/api/company/internships \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Software Engineering Intern",
    "courseRole": "Backend Development",
    "startingDate": "2024-06-01",
    "applicationDeadline": "2024-05-15",
    "duration": "3 months",
    "location": "Bangalore",
    "mode": "On-site",
    "compensationType": "Paid",
    "stipend": 25000,
    "certificateType": "Soft Copy",
    "requiredSkills": ["Python", "Django"],
    "description": "Work on backend systems",
    "internshipDetailsUrl": "https://techcorp.com/intern1",
    "applicationUrl": "https://apply.techcorp.com/intern1"
  }'
```

---

## 🚀 Deployment

### Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smart_internship_finder
JWT_SECRET=your_secure_random_secret_min_32_characters
JWT_EXPIRY=7d
CLIENT_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
AI_SERVICE_URL=http://localhost:8000
NODE_ENV=production
```

### Production Considerations
1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET (min 32 characters)
3. Use MongoDB Atlas for database
4. Enable HTTPS (handled by deployment platform)
5. Set appropriate CORS_ORIGIN
6. Monitor rate limiting logs
7. Set up log aggregation

---

**Documentation Version:** 1.0.0  
**Last Updated:** 2024  
**API Version:** v1
