# 🗺️ Visual Navigation Guide - Apply Now Button

## Current Status
✅ Backend Running: http://localhost:5000/api
✅ Frontend Running: http://10.54.252.220:5173/
✅ 8 Internships with Application URLs loaded

---

## 📍 Route 1: From Homepage

```
http://10.54.252.220:5173/
           ↓
   [Click "Internships" in navigation]
           ↓
http://10.54.252.220:5173/internships
           ↓
   [See list of 8 internship cards]
           ↓
   [Look at bottom-right of each card]
           ↓
   [Click green "Apply Now" button]
           ↓
   [New tab opens → Official company careers page]
```

---

## 📍 Route 2: Direct URL

1. Open browser
2. Type: `http://10.54.252.220:5173/internships`
3. Press Enter
4. You should see internship cards immediately

---

## 🎯 What You'll See

### Internship Cards Layout:

```
┌──────────────────────────────────────────────┐
│  Row 1: [Card 1] [Card 2] [Card 3] [Card 4] │
│  Row 2: [Card 5] [Card 6] [Card 7] [Card 8] │
└──────────────────────────────────────────────┘
```

### Each Card Shows:

```
╔════════════════════════════════════╗
║ [Logo] Software Engineering Intern ║ ← Title
║        Google                      ║ ← Company
╠════════════════════════════════════╣
║ ₹80,000/month · Paid              ║ ← Stipend
║ 📍 Bangalore                       ║ ← Location
║ 📅 Starts Jun 1, 2026              ║ ← Date
║ 📚 Software Development            ║ ← Role
║ 🏆 Hard Copy & Soft Copy           ║ ← Certificate
║                                    ║
║ [Python] [JavaScript] [React]      ║ ← Skills
╠════════════════════════════════════╣
║ ✨ 0% AI Match                     ║ ← Match Score
║                                    ║
║        [Apply Now]  [View Details] ║ ← BUTTONS HERE!
║        └─ Green     └─ Outlined    ║
╚════════════════════════════════════╝
```

---

## 🖱️ Click Test Sequence

### Test 1: Apply from Card
1. Find any internship card
2. Look at bottom right
3. See green "Apply Now" button
4. Click it
5. **Expected:** New tab opens with company careers page

### Test 2: Apply from Detail Modal
1. Find any internship card
2. Click "View Details" (outlined button)
3. Modal popup appears
4. Scroll to bottom
5. See large "Apply Now →" button with external link icon
6. Click it
7. **Expected:** New tab opens with company careers page

---

## 📱 Expected Application URLs

When you click "Apply Now", you'll be redirected to:

| Internship | Company | Opens This URL |
|-----------|---------|----------------|
| Software Engineering Intern | Google | https://careers.google.com/jobs/results/ |
| Data Science Intern | Google | https://careers.google.com/jobs/results/ |
| Full Stack Developer | Microsoft | https://careers.microsoft.com/students |
| Cloud Engineering | Microsoft | https://careers.microsoft.com/students |
| AWS Cloud Intern | Amazon | https://amazon.jobs/en/teams/internships-for-students |
| Frontend Developer | Amazon | https://amazon.jobs/en/teams/internships-for-students |
| Product Development | Zoho | https://www.zoho.com/careers/students.html |
| UI/UX Design | Zoho | https://www.zoho.com/careers/students.html |

---

## ❌ Troubleshooting

### Problem: "I don't see any internships"

**Solution:**
1. Open browser console (F12)
2. Check for errors
3. Verify you're at: http://10.54.252.220:5173/internships
4. Try refreshing the page (Ctrl+R or F5)

### Problem: "Apply Now button is missing"

**Check:**
1. Are you looking at the right spot? (Bottom right of card)
2. Is the button maybe called "View Details" instead?
3. Open browser console (F12) and check for JavaScript errors

### Problem: "Button doesn't open anything"

**Check:**
1. Check if popup blocker is enabled (disable it)
2. Browser console (F12) for errors
3. Try right-click → "Open in new tab"

### Problem: "Page shows 'Unable to load internships'"

**Solution:**
1. Check backend is running: http://localhost:5000/api/internships
2. Check CORS settings
3. Restart backend server

---

## 🧪 Quick Test Command

If you can't see the page, test the API directly:

Open: http://localhost:5000/api/internships

You should see JSON with all 8 internships and their `applicationUrl` fields.

---

## 📞 Next Steps if Still Stuck

1. Open browser
2. Go to: http://10.54.252.220:5173/internships
3. Press F12 (open developer console)
4. Go to "Console" tab
5. Share any error messages you see
6. Take a screenshot and share what you see

---

**Your servers are running and ready!** 🚀
Just open http://10.54.252.220:5173/internships in your browser!
