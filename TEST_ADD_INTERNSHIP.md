# Test Add Internship Feature

## Current Status
- ✅ Backend: Running on port 5000
- ✅ Frontend: Running on port 5173
- ✅ Database: PostgreSQL connected
- ✅ Companies: 27 companies in database
- ✅ Admin Controller: Fixed for Sequelize

## Debugging Steps

### 1. Check if Form Opens
- Login: http://localhost:5173/admin/login
- Credentials: admin@smartintern.com / Admin@2024
- Click big green "Add Internship" button
- **Does modal popup appear?** YES / NO

### 2. Check Companies Dropdown
- Open browser console (F12)
- Look for: "Fetching companies..."
- Look for: "Companies fetched: {companies: Array(27)}"
- **Are companies visible in dropdown?** YES / NO

### 3. Test Form Submission
Fill form with:
```
Job Title: Test Software Intern
Company: [Select Google or TCS]
Location: Bangalore
Duration: 6 months
Mode: On-site
Compensation: Paid
Stipend: 30000
Certificate: Soft Copy
Starting Date: 2024-06-01
Deadline: 2024-05-15
Application URL: https://careers.google.com/test
Skills: JavaScript, React
Description: This is a test internship
```

Click "Add Internship" and check console for:
- "Form Data: {...}"
- "Payload to send: {...}"
- "Success response:" OR "Error:"

## Manual Backend Test

If form doesn't work, test backend directly:

### Test 1: Get Companies
```bash
# Should return list of 27 companies
curl http://localhost:5000/api/admin/companies
```

### Test 2: Add Internship Manually
```bash
curl -X POST http://localhost:5000/api/admin/internships \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Internship",
    "companyId": "3bc6a337-617d-4e33-a808-1317517277b2",
    "location": "Bangalore",
    "duration": "6 months",
    "mode": "On-site",
    "compensationType": "Paid",
    "stipend": 30000,
    "certificateType": "Soft Copy",
    "requiredSkills": ["JavaScript", "React"],
    "description": "Test description",
    "applicationUrl": "https://test.com",
    "startingDate": "2024-06-01",
    "applicationDeadline": "2024-05-15"
  }'
```

## Common Issues & Solutions

### Issue 1: Form doesn't open
**Solution**: Check if `showAddForm` state is updating
- Add console.log in button click handler
- Verify `setShowAddForm(true)` is called

### Issue 2: No companies in dropdown
**Solution**: Check `/admin/companies` endpoint
- Verify admin token is valid
- Check if companies have `verified_status: 'approved'`

### Issue 3: Submit fails
**Possible causes**:
1. Missing required fields
2. Invalid company ID
3. Auth token expired
4. Database connection issue

### Issue 4: "Cannot add internship"
**Check**:
- Backend logs for errors
- Database constraints
- Field validation

## Database Check

Count internships before and after:
```sql
-- Before adding
SELECT COUNT(*) FROM internships;

-- After adding
SELECT COUNT(*) FROM internships;
-- Should increase by 1

-- View last added
SELECT id, title, "companyId", location, status, "createdAt" 
FROM internships 
ORDER BY "createdAt" DESC 
LIMIT 1;
```

## Success Criteria

✅ Form modal opens when clicking button
✅ Companies dropdown is populated  
✅ All form fields are fillable
✅ Submit button is clickable
✅ Success message appears
✅ New internship appears in database
✅ New internship shows in student dashboard
✅ Students receive notification

## Next Steps If Still Failing

1. Share browser console errors
2. Share backend error logs
3. Share screenshot of form
4. Try manual SQL insert to verify database
