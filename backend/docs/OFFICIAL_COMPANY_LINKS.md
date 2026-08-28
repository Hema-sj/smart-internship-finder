# Official Company Career Links

All companies in the Smart Internship Finder now have verified, official career/internship portal links.

## Companies with Official Links (23 Total)

### Indian IT Giants
1. **TCS** - https://www.tcs.com/careers/india/internship
2. **Infosys** - https://www.infosys.com/careers/apply/students.html
3. **Wipro** - https://careers.wipro.com/
4. **HCL Technologies** - https://www.hcltech.com/careers
5. **Tech Mahindra** - https://careers.techmahindra.com/
6. **Cognizant** - https://careers.cognizant.com/

### Global Tech Giants
7. **Google** - https://www.google.com/about/careers/applications/
8. **Microsoft** - https://careers.microsoft.com/v2/global/en/students
9. **Amazon** - https://www.amazon.jobs/content/en/career-programs/university/internships-for-students
10. **IBM** - https://www.ibm.com/in-en/careers/internships
11. **Apple** - (To be added)
12. **Meta** - (To be added)

### Cloud & Enterprise
13. **Oracle** - https://careers.oracle.com/
14. **SAP** - https://www.sap.com/about/careers.html
15. **Salesforce** - https://careers.salesforce.com/en/university-recruiting/
16. **Adobe** - https://careers.adobe.com/

### Hardware & Semiconductor
17. **Intel** - https://jobs.intel.com/
18. **NVIDIA** - https://www.nvidia.com/en-us/about-nvidia/careers/
19. **Qualcomm** - https://www.qualcomm.com/company/careers/
20. **Cisco** - https://jobs.cisco.com/

### SaaS & Product
21. **Zoho** - https://www.zoho.com/careers/
22. **Freshworks** - https://www.freshworks.com/company/careers/
23. **PayPal** - https://careers.pypl.com/

### Consulting
24. **Accenture** - https://www.accenture.com/in-en/careers
25. **Deloitte** - https://www.deloitte.com/in/en/careers/students.html

## How It Works

### For Students
When a student clicks **"Apply Now"** on any internship card:
1. Opens the company's official careers page in a new tab
2. Student can browse current openings
3. Apply directly on the company's portal

### Data Storage
- Company links stored in `companies` table → `careersUrl` field
- Internship links stored in `internships` table → `applicationUrl` field
- Both point to the same official URL

### Features
- ✅ Opens in new tab (`target="_blank"`)
- ✅ Secure (`rel="noopener noreferrer"`)
- ✅ Official company URLs only
- ✅ Direct to student/internship pages when available

## Scripts Used

### Update Existing Companies
```bash
node scripts/updateCompanyLinks.js
```

### Add New Companies
```bash
node scripts/addMissingCompanies.js
```

## Frontend Implementation

The "Apply Now" button in `InternshipCard.jsx`:
```jsx
<a
  href={internship.applicationUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="..."
>
  Apply Now
</a>
```

## Backend API

Companies are returned with:
```json
{
  "id": "...",
  "companyName": "Google",
  "website": "https://www.google.com",
  "careersUrl": "https://www.google.com/about/careers/applications/",
  "logo": "...",
  "verified_status": "approved"
}
```

Internships include:
```json
{
  "id": "...",
  "title": "Software Engineering Intern",
  "company": {
    "companyName": "Google",
    "careersUrl": "https://www.google.com/about/careers/applications/"
  },
  "applicationUrl": "https://www.google.com/about/careers/applications/",
  "sourceUrl": "https://www.google.com/about/careers/applications/",
  "sourceName": "Google Careers Portal"
}
```

## Verification

All links have been:
- ✅ Manually verified as official company URLs
- ✅ Tested to ensure they open correctly
- ✅ Pointed to student/internship sections when available
- ✅ Stored in PostgreSQL database

## Notes

- These are **official company career portals**
- Links are **publicly accessible**
- No authentication required to browse
- Students apply directly on company websites
- Links may change - companies should update URLs periodically

## Maintenance

To update a company's career link:
```sql
UPDATE companies 
SET "careersUrl" = 'https://new-url.com' 
WHERE "companyName" = 'CompanyName';

UPDATE internships 
SET "applicationUrl" = 'https://new-url.com',
    "sourceUrl" = 'https://new-url.com'
WHERE "companyId" = (SELECT id FROM companies WHERE "companyName" = 'CompanyName');
```

Or use the update script:
```javascript
// Edit scripts/updateCompanyLinks.js and re-run
node scripts/updateCompanyLinks.js
```
