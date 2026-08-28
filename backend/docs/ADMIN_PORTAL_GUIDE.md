# Admin Portal Guide

## Overview
The Smart Internship Finder admin portal provides complete platform management capabilities including user management, company verification, internship approval, and application oversight.

## Access

### Admin Login
- **URL**: http://localhost:5173/admin/login
- **Portal**: http://localhost:5173/admin/portal
- **Test Credentials**: 
  - Email: `admin@test.com`
  - Password: `Admin123456`

### Authentication Flow
1. Navigate to `/admin/login`
2. Enter admin email and password
3. System validates admin role
4. Redirect to `/admin/portal` on success

## Admin Dashboard

### Dashboard Stats
**Endpoint**: `GET /api/admin/stats`

Returns platform-wide statistics:
```json
{
  "users": {
    "total": 150,
    "students": 120,
    "companies": 28
  },
  "internships": {
    "total": 45,
    "open": 32
  },
  "applications": {
    "total": 280
  },
  "companies": {
    "pendingVerification": 5
  }
}
```

## User Management

### List All Users
**Endpoint**: `GET /api/admin/users`

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20, max: 100)
- `role`: Filter by role ('student', 'company', 'admin')
- `search`: Search by name or email

Example:
```bash
GET /api/admin/users?role=student&page=1&limit=20
```

Response:
```json
{
  "users": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@test.com",
      "role": "student",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 120,
    "pages": 6
  }
}
```

### Get User Details
**Endpoint**: `GET /api/admin/users/:id`

Returns user profile with associated student/company data.

### Delete User
**Endpoint**: `DELETE /api/admin/users/:id`

- Permanently deletes user account
- Cascades to associated profile (student or company)
- Cannot delete your own admin account

## Company Management

### List All Companies
**Endpoint**: `GET /api/admin/companies`

Query Parameters:
- `page`, `limit`: Pagination
- `verified`: Filter by verification status (true/false)
- `search`: Search by company name

### Verify Company
**Endpoint**: `PATCH /api/admin/companies/:id/verify`

Request Body:
```json
{
  "verified": true
}
```

**Important**: Companies must be verified before they can post internships.

Verification Process:
1. Company registers and creates profile
2. Admin reviews company details
3. Admin verifies company via API
4. Company gains permission to post internships

## Internship Management

### List All Internships
**Endpoint**: `GET /api/admin/internships`

Query Parameters:
- `page`, `limit`: Pagination
- `status`: Filter by status ('Draft', 'Open', 'Closed')
- `companyId`: Filter by company

Response:
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "Software Engineering Intern",
      "status": "Open",
      "companyId": {
        "name": "Google",
        "verified": true
      },
      "location": "Bangalore",
      "compensationType": "Paid",
      "stipend": 50000
    }
  ],
  "pagination": { ... }
}
```

### Update Internship Status
**Endpoint**: `PATCH /api/admin/internships/:id/status`

Request Body:
```json
{
  "status": "Open"  // or "Draft", "Closed"
}
```

Valid Status Values:
- **Draft**: Not visible to students
- **Open**: Active, students can apply
- **Closed**: No longer accepting applications

### Delete Internship
**Endpoint**: `DELETE /api/admin/internships/:id`

Permanently removes internship listing.

## Application Oversight

### List All Applications
**Endpoint**: `GET /api/admin/applications`

Query Parameters:
- `page`, `limit`: Pagination
- `status`: Filter by application status
- `companyId`: Filter by company

View all student applications across the platform for monitoring and compliance.

## Role-Based Access Control

### Admin Permissions
Admins have full access to:
- ✅ View all users, companies, internships, applications
- ✅ Verify/unverify companies
- ✅ Approve/reject internships
- ✅ Delete users (except self)
- ✅ Delete internships
- ✅ View platform statistics

### Protected Routes
All admin routes require:
1. Valid JWT token (authentication)
2. Role = 'admin' (authorization)

Middleware chain:
```javascript
router.use(requireAuth, requireRole('admin'));
```

## Creating Admin Users

### Option 1: Direct Database Creation
Use PostgreSQL to create admin user:
```sql
INSERT INTO users (id, name, email, password, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Admin User',
  'admin@example.com',
  '$2a$10$hashed_password_here',  -- Use bcrypt
  'admin',
  NOW(),
  NOW()
);
```

### Option 2: Registration Endpoint (Development Only)
For development, you can modify the register endpoint to accept admin role.

**Production**: Disable admin registration via API for security.

## Security Best Practices

### 1. JWT Token Security
- Tokens expire after 7 days (configurable)
- Store JWT_SECRET in environment variables
- Use HTTPS in production

### 2. Admin Access
- Limit admin accounts (1-3 for small teams)
- Use strong passwords (min 12 characters)
- Enable 2FA (future enhancement)
- Log all admin actions (future enhancement)

### 3. Data Privacy
- Admins should not access student resumes without consent
- Log admin views of sensitive data
- Comply with GDPR/data protection laws

### 4. Rate Limiting
Current limit: 50 requests per 15 minutes
```javascript
// backend/server.js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50
});
```

## Admin Workflow Examples

### Example 1: Verify New Company
```bash
# 1. List pending companies
GET /api/admin/companies?verified=false

# 2. Review company details
GET /api/admin/users/:companyUserId

# 3. Verify company
PATCH /api/admin/companies/:companyId/verify
{
  "verified": true
}
```

### Example 2: Approve Internship
```bash
# 1. List pending internships
GET /api/admin/internships?status=Draft

# 2. Review internship details
GET /api/admin/internships/:id

# 3. Approve internship
PATCH /api/admin/internships/:id/status
{
  "status": "Open"
}
```

### Example 3: Handle Spam User
```bash
# 1. Search for user
GET /api/admin/users?search=spam@email.com

# 2. Get user details
GET /api/admin/users/:userId

# 3. Delete user
DELETE /api/admin/users/:userId
```

## Testing Admin Portal

### 1. Login Test
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "Admin123456"
}

# Expected: 200 OK with token and role='admin'
```

### 2. Stats Test
```bash
GET http://localhost:5000/api/admin/stats
Authorization: Bearer <admin_token>

# Expected: Platform statistics object
```

### 3. User Management Test
```bash
GET http://localhost:5000/api/admin/users?limit=5
Authorization: Bearer <admin_token>

# Expected: List of 5 users
```

## Frontend Admin Portal

Current Implementation:
- Basic admin portal page at `/admin/portal`
- Shows overview cards for Students, Companies, Moderation

Future Enhancements Needed:
1. **Dashboard**: Display real statistics from API
2. **User Table**: Browse and manage users
3. **Company Verification**: Queue of pending companies
4. **Internship Approval**: Review and approve listings
5. **Charts**: Visual analytics (users over time, applications, etc.)
6. **Search**: Global search across all entities
7. **Filters**: Advanced filtering and sorting
8. **Export**: CSV export for reports

## API Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (not admin) |
| 404 | Not Found |
| 500 | Server Error |

## Common Issues & Solutions

### Issue: "Forbidden" error on admin routes
**Solution**: Verify JWT token includes `role: 'admin'`

### Issue: Cannot delete user
**Solution**: Check if trying to delete own account (not allowed)

### Issue: Company can't post internships
**Solution**: Verify company via `/api/admin/companies/:id/verify`

### Issue: Internship not visible to students
**Solution**: Check status is 'Open' not 'Draft' or 'Closed'

## Monitoring & Logs

Admin actions are logged in console with prefix:
```
[Admin] User admin@test.com deleted company XYZ
[Admin] Company TCS verified by admin@test.com
```

## Future Features

1. **Activity Log**: Track all admin actions
2. **Bulk Operations**: Bulk approve/delete
3. **Email Notifications**: Notify companies of verification
4. **Analytics Dashboard**: Charts and graphs
5. **Export Reports**: CSV/Excel exports
6. **Advanced Search**: Full-text search across platform
7. **Role Management**: Create custom admin roles
8. **Audit Trail**: Complete history of changes
9. **2FA**: Two-factor authentication
10. **IP Whitelist**: Restrict admin access by IP

---

**Last Updated**: Task #8 Completion
**Admin API Version**: v1.0
**Security Level**: Medium (suitable for development/MVP)
