# 🎯 Admin Dashboard - Complete Feature Guide

## 🌐 Access Links
- **Frontend**: http://localhost:5173
- **Admin Login**: http://localhost:5173/admin/login
- **Admin Dashboard**: http://localhost:5173/admin/dashboard
- **Backend API**: http://localhost:5000/api
- **AI Service**: http://localhost:8000

## 🔐 Admin Credentials
```
Email: admin@smartintern.com
Password: Admin@2024
```

---

## ✨ New Features Implemented

### 1️⃣ **New Internship Notifications** 🔔
**Location**: Dashboard → "New Internships" Tab

**Features**:
- Automatically tracks all internships posted in the last 7 days
- Shows company name, verified status, location, and compensation
- Direct link to application URL for each internship
- Real-time notification counter in sidebar
- Verified company badge display

**API Endpoint**: `GET /api/admin/internships/notifications/new`

**What it shows**:
- Number of new internships (last 7 days)
- Company details with verification badge
- Paid/Unpaid status with stipend amount
- Posted date
- Direct "View Link" button to application URL

---

### 2️⃣ **Company Access Management** 🏢
**Location**: Dashboard → "Company Access" Tab

**Features**:
- View all companies awaiting verification
- Approve companies to give them access to:
  - Post internships
  - Communicate with students
  - Access company portal
- Reject companies with reason
- Automatic notification sent to company upon approval/rejection
- Real-time pending count badge in sidebar

**API Endpoints**:
- `GET /api/admin/companies/pending` - Get pending companies
- `POST /api/admin/companies/:companyId/approve` - Approve company
- `POST /api/admin/companies/:companyId/reject` - Reject company

**Approval Process**:
1. Click "Approve" button
2. Company status changes to `verified: true`
3. Company receives notification: "Your company has been verified..."
4. Company can now post internships and access full portal

**Rejection Process**:
1. Click "Reject" button
2. Enter rejection reason
3. Company receives notification with reason
4. Company status remains `verified: false`

---

### 3️⃣ **Add Internship with Links** ➕
**Location**: Dashboard → "Manage Internships" Tab → "Add New Internship"

**Form Fields**:
- **Job Title** * (e.g., Software Development Intern)
- **Company** * (dropdown from verified companies)
- **Location** * (Bangalore, Chennai, Hyderabad, Pune, Mumbai, Delhi, Noida, Remote, etc.)
- **Duration** * (e.g., 3 months, 6 months)
- **Mode** * (Remote, On-site, Hybrid)
- **Compensation Type** * (Paid, Unpaid)
- **Stipend** (₹/month) - shown only if Paid
- **Certificate Type** * (Soft Copy, Hard Copy, Both, Not Provided)
- **Starting Date** * (date picker)
- **Application Deadline** * (date picker)
- **Application URL** * (direct application link)
- **Required Skills** * (comma-separated: JavaScript, React, Python)
- **Description** * (full internship description)

**API Endpoint**: `POST /api/admin/internships`

**What happens when you add**:
1. Internship is created with status `Open`
2. All registered students receive notification
3. Notification message: "{Company} has posted a new internship: {Title}"
4. Internship appears in main listings
5. Students can apply via the application URL

---

### 4️⃣ **Enhanced Dashboard Overview** 📊
**Location**: Dashboard → "Dashboard" Tab

**Statistics Cards**:
- **Total Users**: Shows total, students, and companies count
- **Total Internships**: Shows total and currently open count
- **Total Applications**: Shows all applications tracked
- **Pending Verification**: Shows companies waiting for approval

**Quick Actions**:
- View New Internships
- Approve Companies
- Add Internship

---

### 5️⃣ **Manage Internships** 💼
**Location**: Dashboard → "Manage Internships" Tab

**Features**:
- View all internships in table format
- Columns: Title, Company, Location, Type (Paid/Unpaid), Status
- Direct link to application URL (External Link icon)
- Color-coded status badges:
  - Open: Green
  - Draft: Yellow
  - Closed: Red

---

### 6️⃣ **Manage Users** 👥
**Location**: Dashboard → "Manage Users" Tab

**Features**:
- View all registered users
- Shows: Name, Email, Role, Join Date
- Filter by role (student/company/admin)
- User statistics

---

## 🔄 Notification System

### Student Notifications
When admin adds a new internship:
- **All students** receive notification
- Notification type: `new_internship`
- Message: "{Company Name} has posted a new internship: {Title}"
- Links to internship detail page

### Company Notifications
When admin approves/rejects company:
- **Company user** receives notification
- Approval type: `company_approved`
- Rejection type: `company_rejected`
- Custom message can be included

---

## 🎨 UI/UX Features

### Navigation Sidebar
- **Dashboard** - Platform overview
- **New Internships** 🔔 - Shows notification badge
- **Company Access** 🏢 - Shows pending count badge
- **Manage Internships** 💼
- **Manage Users** 👥

### Color Scheme
- **Primary**: Emerald (Green) - Success, Active, Approved
- **Warning**: Orange - Pending, Awaiting Action
- **Danger**: Red - Rejected, Closed, Critical
- **Info**: Blue - Verified, Informational
- **Neutral**: Slate - Default, Inactive

### Status Badges
- **Verified Company**: Blue badge with checkmark
- **Paid Internship**: Green badge
- **Unpaid Internship**: Gray badge
- **Open Status**: Green badge
- **Pending Verification**: Orange badge

---

## 📡 API Endpoints Reference

### Admin Dashboard Stats
```
GET /api/admin/stats
Response: {
  users: { total, students, companies },
  internships: { total, open },
  applications: { total },
  companies: { pendingVerification }
}
```

### New Internship Notifications
```
GET /api/admin/internships/notifications/new
Response: {
  count: number,
  internships: [{ id, title, company, location, compensationType, stipend, createdAt, applicationUrl }]
}
```

### Pending Companies
```
GET /api/admin/companies/pending
Response: {
  count: number,
  companies: [{ _id, name, logo, industry, userId, website, createdAt }]
}
```

### Approve Company
```
POST /api/admin/companies/:companyId/approve
Body: { message: "Custom approval message" }
Response: { message, company }
```

### Reject Company
```
POST /api/admin/companies/:companyId/reject
Body: { reason: "Rejection reason" }
Response: { message, company }
```

### Create Internship
```
POST /api/admin/internships
Body: {
  title*, companyId*, location*, duration*, mode*, 
  compensationType*, stipend, certificateType*,
  requiredSkills*, description*, applicationUrl*,
  startingDate*, applicationDeadline*
}
Response: { message, internship }
```

### List All Internships
```
GET /api/admin/internships?page=1&limit=20&status=Open
Response: { items, pagination }
```

### List All Users
```
GET /api/admin/users?page=1&limit=20&role=student
Response: { users, pagination }
```

---

## 🚀 How to Use

### Step 1: Login as Admin
1. Go to http://localhost:5173/admin/login
2. Enter credentials:
   - Email: admin@smartintern.com
   - Password: Admin@2024
3. Click "Log in to admin portal"
4. You'll be redirected to http://localhost:5173/admin/dashboard

### Step 2: Check New Internships
1. Click "New Internships" in sidebar
2. View all internships posted in last 7 days
3. See which companies posted new opportunities
4. Click "View Link" to check application URLs

### Step 3: Approve Companies
1. Click "Company Access" in sidebar
2. Review pending companies
3. Click "Approve" to give access
4. Company receives notification and can post internships
5. OR click "Reject" and enter reason

### Step 4: Add New Internship
1. Click "Manage Internships" in sidebar
2. Click "Add New Internship" button
3. Fill in all required fields
4. Select company from dropdown
5. Enter application URL (e.g., https://company.com/careers/apply)
6. Click "Add Internship"
7. All students receive notification

### Step 5: Monitor Platform
1. Click "Dashboard" to see overview
2. Check total users, internships, applications
3. See pending company verifications
4. Use Quick Actions for common tasks

---

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Role-based access control (admin role required)
- ✅ Protected routes with middleware
- ✅ All admin endpoints require `requireAuth` + `requireRole('admin')`
- ✅ Secure token storage in localStorage
- ✅ Auto-logout on unauthorized access

---

## 📊 Current Database Stats

```
✅ Database: smart_internship_finder (PostgreSQL)
✅ Port: 5432
✅ Credentials: postgres/admin123

Current Data:
- 112 Internships (77 Paid, 35 Unpaid)
- 27 Companies
- 22 Locations
- 5+ Users (students, companies, admin)
- 70+ Official career links
```

---

## 🎉 Success!

Your admin dashboard is now fully functional with:
- ✅ Real-time internship notifications
- ✅ Company access management
- ✅ Add internship with application links
- ✅ Comprehensive user management
- ✅ Platform statistics and monitoring
- ✅ Secure authentication and authorization

**All services are running:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- AI Service: http://localhost:8000

**Ready to use!** 🚀
