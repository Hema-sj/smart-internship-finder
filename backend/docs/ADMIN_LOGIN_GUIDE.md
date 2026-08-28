# Admin Login & Access Guide

The Smart Internship Finder already has a **complete Admin Login system** with role-based access control.

## 🔐 Admin Credentials

### Default Admin Account
```
Email:    admin@smartintern.com
Password: Admin@2024
```

**Login URL**: http://localhost:5173/admin/login

---

## 📋 System Overview

### Authentication Flow

1. **Admin Login Page** (`/admin/login`)
   - Separate login form for admins
   - Email & password authentication
   - Backend endpoint: `POST /api/auth/admin/login`

2. **JWT Token**
   - JWT token issued with `role: 'admin'`
   - Token stored in HTTP-only cookie
   - Auto-expires after session timeout

3. **Role-Based Protection**
   - Frontend: `RoleProtectedRoute` component
   - Backend: `requireRole('admin')` middleware
   - Unauthorized users get 403 Forbidden

4. **Admin Dashboard** (`/admin/portal`)
   - Only accessible by authenticated admins
   - Protected by both auth + role checks
   - Shows system statistics and management tools

---

## 🛡️ Security Implementation

### Frontend Protection

**1. Route Guards**
```jsx
// App.jsx
<Route path="/admin/portal" element={
  <ProtectedRoute>
    <RoleProtectedRoute allowedRoles={['admin']}>
      <AdminPortalPage />
    </RoleProtectedRoute>
  </ProtectedRoute>
} />
```

**2. RoleProtectedRoute Component**
```jsx
// components/RoleProtectedRoute.jsx
- Checks if user is authenticated
- Verifies user role matches allowedRoles
- Redirects to /login if not authenticated
- Shows "Access Denied" if wrong role
```

### Backend Protection

**1. Authentication Middleware**
```javascript
// middleware/authMiddleware.js
export function requireAuth(req, res, next) {
  // Verifies JWT token
  // Attaches user to request
  // Returns 401 if not authenticated
}
```

**2. Role Middleware**
```javascript
// middleware/roleMiddleware.js
export function requireRole(...roles) {
  // Checks user.role against allowed roles
  // Returns 403 if wrong role
}
```

**3. Protected Admin Routes**
```javascript
// routes/adminRoutes.js
router.use(requireAuth, requireRole('admin'));
// All routes below require admin role
router.get('/stats', getDashboardStats);
router.get('/users', listUsers);
router.get('/internships', listAllInternships);
// ... etc
```

---

## 📍 Admin Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login

### Dashboard
- `GET /api/admin/stats` - System statistics

### User Management
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get user details
- `DELETE /api/admin/users/:id` - Delete user

### Internship Management
- `GET /api/admin/internships` - List all internships
- `PATCH /api/admin/internships/:id/status` - Approve/reject internship
- `DELETE /api/admin/internships/:id` - Delete internship

### Company Management
- `GET /api/admin/companies` - List all companies
- `PATCH /api/admin/companies/:id/verify` - Verify company

### Applications
- `GET /api/admin/applications` - View all applications

---

## 🎯 How to Use

### For Administrators

**Step 1: Login**
1. Go to: http://localhost:5173/admin/login
2. Enter:
   - Email: `admin@smartintern.com`
   - Password: `Admin@2024`
3. Click "Login"

**Step 2: Access Admin Portal**
- Auto-redirected to: http://localhost:5173/admin/portal
- See dashboard with:
  - Total users
  - Total internships
  - Total companies
  - System statistics

**Step 3: Manage System**
- Approve/reject internships
- Verify companies
- View all users
- Monitor applications
- Delete inappropriate content

### For Regular Users

**Cannot Access Admin Pages:**
- Student trying to access `/admin/portal` → Redirected to login
- Company trying to access `/admin/portal` → "Access Denied" message
- Only users with `role: 'admin'` can access

---

## 🔧 Creating New Admin Accounts

### Using Script
```bash
cd backend
node scripts/createTestUsers.js
```

### Manual Creation (Database)
```sql
-- Create admin user
INSERT INTO users (email, password, role, name, "isVerified")
VALUES (
  'newadmin@example.com',
  -- Hash password with bcrypt (10 rounds)
  '$2b$10$hashedpasswordhere',
  'admin',
  'Admin Name',
  true
);
```

### Using Backend API (if implemented)
```javascript
// POST /api/auth/admin/register (if enabled)
{
  "email": "newadmin@example.com",
  "password": "SecurePassword123",
  "name": "Admin Name"
}
```

---

## 🚨 Security Best Practices

### Already Implemented
✅ Password hashing with bcrypt (10 rounds)
✅ JWT tokens with expiration
✅ HTTP-only cookies (prevents XSS)
✅ Role-based access control
✅ Frontend + Backend protection
✅ 403 Forbidden for unauthorized access

### Recommended Enhancements (Optional)
- [ ] 2FA (Two-Factor Authentication)
- [ ] Rate limiting on login attempts
- [ ] Account lockout after failed attempts
- [ ] Audit logs for admin actions
- [ ] Session management dashboard
- [ ] IP whitelisting for admin access

---

## 🧪 Testing

### Test Admin Login
```bash
# 1. Start backend
cd backend
npm start

# 2. Start frontend
cd frontend
npm run dev

# 3. Open browser
# http://localhost:5173/admin/login

# 4. Login with:
# Email: admin@smartintern.com
# Password: Admin@2024

# 5. Verify access to:
# http://localhost:5173/admin/portal
```

### Test Access Control
```bash
# 1. Login as student
# Email: student@smartintern.com
# Password: Student@2024

# 2. Try to access:
# http://localhost:5173/admin/portal

# 3. Should show "Access Denied" or redirect
```

---

## 📁 File Structure

### Frontend
```
frontend/src/
├── pages/
│   ├── AdminLoginPage.jsx      # Admin login page
│   └── AdminPortalPage.jsx     # Admin dashboard
├── components/
│   ├── ProtectedRoute.jsx      # Auth guard
│   └── RoleProtectedRoute.jsx  # Role-based guard
└── context/
    └── AuthContext.jsx         # Auth state management
```

### Backend
```
backend/
├── controllers/
│   ├── authController.js       # Login logic
│   └── adminController.js      # Admin operations
├── middleware/
│   ├── authMiddleware.js       # JWT verification
│   └── roleMiddleware.js       # Role checks
└── routes/
    ├── authRoutes.js           # Auth endpoints
    └── adminRoutes.js          # Admin endpoints
```

---

## 🔄 Login Flow Diagram

```
User → Admin Login Page (/admin/login)
  ↓
Enter credentials
  ↓
POST /api/auth/admin/login
  ↓
Backend verifies:
  - Email exists
  - Password correct
  - Role is 'admin'
  ↓
Issue JWT token with role
  ↓
Set HTTP-only cookie
  ↓
Frontend receives response
  ↓
Update AuthContext
  ↓
Redirect to /admin/portal
  ↓
RoleProtectedRoute checks role
  ↓
✅ Allow access (if admin)
❌ Deny access (if not admin)
```

---

## 💡 Key Features

### What's Already Working
1. ✅ **Separate Admin Login** - `/admin/login` page
2. ✅ **JWT Authentication** - Secure token-based auth
3. ✅ **Role-Based Access** - Only admins can access admin routes
4. ✅ **Frontend Guards** - `RoleProtectedRoute` component
5. ✅ **Backend Guards** - `requireRole('admin')` middleware
6. ✅ **Admin Dashboard** - Full-featured admin portal
7. ✅ **Secure Cookies** - HTTP-only cookies prevent XSS
8. ✅ **Password Hashing** - Bcrypt with 10 rounds

### No Changes Needed
- ❌ Student/User login unaffected
- ❌ UI/UX unchanged
- ❌ AI features unaffected
- ❌ Internship search unchanged
- ❌ Database structure unchanged

---

## 📞 Support

**Admin Login Not Working?**
1. Check backend is running: http://localhost:5000
2. Check credentials are correct
3. Check browser console for errors
4. Check backend logs for auth errors

**"Access Denied" Message?**
- User role is not 'admin'
- Create admin account with script
- Verify user.role in database

**Can't Access Admin Portal?**
- Must be logged in first
- Must have admin role
- Check JWT token is valid
- Clear cookies and login again

---

## 🎉 Summary

Your Smart Internship Finder **already has a complete Admin Login system**:

✅ Separate admin login page  
✅ Role-based access control  
✅ Secure JWT authentication  
✅ Frontend + Backend protection  
✅ Admin dashboard with management tools  
✅ No changes needed - it's fully functional!

**Test it now:** http://localhost:5173/admin/login
