# Skill-Based Internship Notifications

## Overview
The Smart Internship Finder automatically notifies students when new internships match their skills profile. This ensures students never miss relevant opportunities.

## How It Works

### 1. Skill Matching Algorithm
- Compares student's skills with internship requirements
- Calculates match percentage (0-100%)
- Default notification threshold: **50%** match
- Case-insensitive matching with partial matches

### 2. Notification Triggers

#### Automatic Triggers
- **Profile Update**: When a student adds or updates skills in their profile
- **New Internship**: When admin approves a new internship (future enhancement)

#### Manual Trigger
Students can manually check for matching internships:
```
POST /api/students/me/notify-matches
Authorization: Bearer <token>
```

### 3. Notification Format
```json
{
  "title": "85% Match: Software Engineering Intern",
  "message": "New Software Engineering Intern opportunity at Google matches 85% of your skills! Location: Bangalore. Duration: 3 months. Compensation: Paid. Internship ID: <uuid>",
  "type": "match",
  "read": false
}
```

## API Endpoints

### Get Notifications
```
GET /api/students/me/notifications
Authorization: Bearer <token>

Response: [
  {
    "id": "uuid",
    "title": "85% Match: Software Engineering Intern",
    "message": "...",
    "type": "match",
    "read": false,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### Trigger Skill Matching
```
POST /api/students/me/notify-matches
Authorization: Bearer <token>

Response: {
  "success": true,
  "message": "Found 5 matching internships",
  "notificationsCreated": 5
}
```

### Mark Notification as Read
```
PATCH /api/students/me/notifications/:id/read
Authorization: Bearer <token>
```

### Mark All as Read
```
PATCH /api/students/me/notifications/read-all
Authorization: Bearer <token>
```

## Configuration

### Match Threshold
Adjust in `backend/services/notificationService.js`:

```javascript
// For profile updates
await notifyStudentOfMatchingInternships(profile, 50);  // 50% threshold

// For new internships
await notifyMatchingStudents(internship, 40);  // 40% threshold
```

### Skill Matching Logic
The matching algorithm uses:
- **Exact matches**: "Python" = "python" = "PYTHON"
- **Partial matches**: "React" matches "React.js", "ReactJS"
- **Overlap**: Counts how many required skills the student has
- **Percentage**: (matched skills / required skills) × 100

## Database Schema

### Notification Model
```javascript
{
  id: UUID (primary key),
  studentId: UUID (foreign key),
  title: String,
  message: Text,
  type: Enum ['application', 'match', 'reminder', 'system'],
  read: Boolean (default: false),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Example Flow

1. **Student Updates Profile**
   ```
   PUT /api/students/me/profile
   {
     "skills": ["Python", "Java", "React", "Node.js", "MongoDB"]
   }
   ```

2. **System Matches Internships**
   - Finds all open, approved internships
   - Calculates match percentage for each
   - Creates notifications for matches ≥50%

3. **Student Receives Notifications**
   - Google internship: 80% match (4/5 skills)
   - Amazon internship: 60% match (3/5 skills)
   - Microsoft internship: 50% match (2/4 skills)

4. **Student Views Notifications**
   ```
   GET /api/students/me/notifications
   ```

5. **Student Clicks Internship**
   - Notification contains internship ID
   - Frontend navigates to `/internships/:id`
   - Student can apply directly

## Future Enhancements

1. **Real-time Notifications**
   - WebSocket integration
   - Push notifications
   - Email notifications

2. **Smart Filtering**
   - Location-based matching
   - Compensation preferences
   - Duration preferences

3. **Learning Recommendations**
   - Suggest skills to learn
   - Link to learning resources
   - Career path guidance

4. **Notification Preferences**
   - Customize match threshold
   - Email digest frequency
   - Notification categories

## Testing

### Test Scenario 1: Profile Update
```bash
# 1. Login
POST /api/auth/login
{
  "email": "student@test.com",
  "password": "Test123456"
}

# 2. Update skills
PUT /api/students/me/profile
Authorization: Bearer <token>
{
  "skills": ["Python", "Java", "React"]
}

# 3. Check notifications
GET /api/students/me/notifications
Authorization: Bearer <token>
```

### Test Scenario 2: Manual Trigger
```bash
# 1. Login
POST /api/auth/login

# 2. Trigger matching
POST /api/students/me/notify-matches
Authorization: Bearer <token>

# 3. Check response
{
  "success": true,
  "message": "Found 3 matching internships",
  "notificationsCreated": 3
}
```

## Troubleshooting

### No Notifications Created
- Check if student has skills in profile
- Verify internships exist with status='Approved' and applicationStatus='Open'
- Check match threshold (default 50%)
- Look for console logs: `[Notification Service] Created X skill-match notifications`

### Duplicate Notifications
- System checks for existing notifications before creating
- Uses internship ID in message field to prevent duplicates

### Performance Issues
- Bulk insert used for multiple notifications
- Database indexes on studentId and type fields
- Async processing doesn't block profile updates

## Support
For issues or questions, check:
- Backend logs: `[Notification Service]` prefix
- Database: `notifications` table
- API health: `GET /api/health`
