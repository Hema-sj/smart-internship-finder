# Smart Internship Finder - System Architecture

## Overview

Smart Internship Finder is a three-tier web application designed to connect engineering students with internship opportunities using AI-powered matching and skill analysis.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  React 18 + Vite + Tailwind CSS + React Router + Axios      │
│                     (Port 5173 / 5000)                       │
└─────────────┬──────────────────────────────┬─────────────────┘
              │                              │
              │ HTTP/REST API                │ HTTP/REST API
              │ (with credentials)           │ (direct calls)
              ▼                              ▼
┌─────────────────────────────┐   ┌────────────────────────────┐
│      Backend Layer          │   │    AI Service Layer        │
│  Node.js + Express + JWT    │◄──┤  Python + FastAPI + spaCy  │
│      (Port 5000)            │   │      (Port 8000)           │
└─────────────┬───────────────┘   └────────────────────────────┘
              │                              ▲
              │ Mongoose ODM                 │
              │                              │ Resume parsing
              ▼                              │ & AI matching
┌─────────────────────────────┐             │
│     Database Layer          │             │
│    MongoDB + Mongoose       │             │
│   (Port 27017 / Atlas)      │             │
└─────────────────────────────┘             │
                                            │
                              File uploads (multipart/form-data)
```

## Component Details

### 1. Frontend (React SPA)

**Technology Stack:**
- React 18 with functional components and hooks
- Vite for fast development and optimized production builds
- Tailwind CSS for utility-first styling
- React Router v6 for client-side routing
- Axios for HTTP requests with interceptors
- Lucide React for consistent iconography
- Recharts for data visualization (admin dashboard)

**Key Features:**
- **Authentication Context**: Manages user state across the app
- **Protected Routes**: Role-based access control (student, company, admin)
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Lazy Loading**: Code-splitting for optimal performance
- **Form Validation**: Client-side validation with error messaging
- **Real-time Search**: Debounced search with URL parameter sync

**Page Structure:**
```
Public Pages (AppLayout)
├── Home
├── Internship List
├── Internship Detail
├── Locations
├── Login/Register
├── Company Login/Register
└── Admin Login

Student Dashboard (DashboardLayout with Sidebar)
├── Dashboard
├── Applications
├── Saved Internships
├── Profile
├── Resume Builder
├── Resources
└── Notifications

Company Portal (AppLayout)
└── Company Management

Admin Portal (AppLayout)
└── Platform Administration
```

### 2. Backend (Express REST API)

**Technology Stack:**
- Node.js v18+ with ES modules
- Express.js for HTTP server and routing
- Mongoose for MongoDB object modeling
- JWT (jsonwebtoken) for stateless authentication
- bcrypt for password hashing
- Multer for file uploads
- Cookie-parser for session management
- CORS for cross-origin requests

**Architecture Patterns:**
- **MVC Pattern**: Models, Controllers, Routes separation
- **Middleware Chain**: Auth → Role Guard → Controller
- **Service Layer**: Business logic extraction (locationStats)
- **Error Handling**: Centralized error middleware
- **Validation**: Mongoose schema validation + custom validators

**Key Modules:**

```
Routes → Middleware → Controllers → Models → Database
  ↓
Auth Routes      → requireAuth       → authController      → User Model
Student Routes   → requireRole       → studentController   → StudentProfile, Resume
Company Routes   → requireOwnership  → companyController   → Company, Internship
Admin Routes     → requireRole       → adminController     → All Models
Internship Routes→ (public)          → internshipController→ Internship
```

**Authentication Flow:**
```
1. User submits credentials → POST /api/auth/login
2. Backend validates password with bcrypt.compare()
3. JWT token generated with 7-day expiry
4. Token sent in HTTP-only cookie (secure in production)
5. Subsequent requests include cookie
6. requireAuth middleware verifies JWT
7. User object attached to request.user
8. requireRole checks user.role against allowed roles
```

**Database Models:**

| Model | Purpose | Key Relationships |
|-------|---------|-------------------|
| User | Authentication & authorization | Referenced by StudentProfile, Company |
| StudentProfile | Student-specific data | References Skills, Contains Projects/Certifications |
| Company | Company profiles | Referenced by Internships |
| Internship | Job listings | References Company, Skills |
| Application | Application tracking | References Student, Internship, Company |
| Resume | Uploaded resumes with AI data | References StudentProfile |
| SavedInternship | Bookmarked opportunities | References Student, Internship |
| Notification | User notifications | References StudentProfile |
| Review | Company reviews | References StudentProfile, Company |
| LearningResource | Skill development resources | References Skill |
| Skill | Standardized skill taxonomy | Referenced by many models |

**Indexes:**
- User: email (unique), role
- StudentProfile: userId, location, skills
- Company: userId, location, verified
- Internship: companyId, course, location, compensationType, status, aiMatch
- Application: studentId, internshipId, companyId, status
- Notification: studentId, read
- Resume: studentId, uploadedAt

### 3. AI Service (FastAPI Microservice)

**Technology Stack:**
- Python 3.10+
- FastAPI for async REST API
- spaCy for NLP and entity recognition
- scikit-learn for TF-IDF vectorization and cosine similarity
- pdfminer.six for PDF text extraction
- python-docx for DOCX parsing
- pydantic for request/response validation

**Key Services:**

**resume_parser.py**
```python
Input:  PDF/DOCX file bytes
Process:
  1. Extract raw text (pdfminer for PDF, python-docx for DOCX)
  2. Split into sections (education, experience, skills, projects, certifications)
  3. Parse education (detect degrees, institutions, years)
  4. Parse experience (companies, roles, descriptions)
  5. Parse projects (titles, descriptions, URLs)
  6. Parse certifications (titles, issuers)
  7. Extract skills from entire text
Output: Structured JSON with all parsed sections
```

**skill_extractor.py**
```python
Input:  Free-form text (resume, job description)
Process:
  1. Tokenize and normalize text
  2. Match against curated skill database (500+ tech skills)
  3. Use spaCy NER for custom skill recognition
  4. Deduplicate and standardize skill names
Output: List of recognized skills
```

**matcher.py**
```python
Input:  Candidate text, Internship text
Process:
  1. TF-IDF Vectorization (TfidfVectorizer from sklearn)
  2. Compute cosine similarity between vectors
  3. Normalize score to 0-100 range
  4. Classify into levels (Excellent 90+, Strong 75-89, Moderate 60-74, Low <60)
Output: Match score (integer 0-100) and level (string)

Skill Gap Analysis:
Input:  Student skills, Required skills
Process:
  1. Find matched skills (intersection)
  2. Find missing skills (required - student)
  3. Find bonus skills (student - required)
  4. Calculate match percentage
Output: Categorized skill lists + match score
```

**AI Endpoints:**
- `POST /api/resume/analyze`: Upload resume → Parsed data
- `POST /api/skills/extract`: Text → Skill list
- `POST /api/match`: Two texts → Match score
- `POST /api/match/batch`: Candidate + Multiple internships → Sorted matches
- `POST /api/match/skills`: Skill lists → Gap analysis

### 4. Database (MongoDB)

**Schema Design:**

**Collections:**
- `users`: User accounts (student, company, admin)
- `studentprofiles`: Student-specific data
- `companies`: Company profiles
- `internships`: Internship listings
- `applications`: Application records
- `resumes`: Uploaded resume metadata
- `savedinternships`: Bookmarked internships
- `notifications`: User notifications
- `reviews`: Company reviews
- `learningresources`: Educational content
- `skills`: Standardized skill taxonomy

**Data Modeling:**
- **Normalization**: Separate collections for entities (User, StudentProfile, Company)
- **Embedding**: Arrays for projects, certifications, interests
- **References**: ObjectId references with `.populate()` for relationships
- **Indexing**: Strategic indexes on frequently queried fields

## Data Flow Examples

### 1. Student Registration Flow

```
Frontend                Backend                 Database
   │                       │                       │
   │ POST /api/auth/       │                       │
   │ register              │                       │
   ├──────────────────────>│                       │
   │                       │                       │
   │                       │ Hash password         │
   │                       │ (bcrypt)              │
   │                       │                       │
   │                       │ Create User           │
   │                       ├──────────────────────>│
   │                       │                       │
   │                       │ Create StudentProfile │
   │                       ├──────────────────────>│
   │                       │                       │
   │                       │ Generate JWT          │
   │                       │ Set cookie            │
   │                       │                       │
   │ 200 OK                │                       │
   │ {user, profile, token}│                       │
   │<──────────────────────│                       │
   │                       │                       │
   │ Redirect to           │                       │
   │ /dashboard            │                       │
```

### 2. Resume Upload & AI Parsing Flow

```
Frontend              Backend                AI Service         Database
   │                     │                       │                │
   │ FormData            │                       │                │
   │ POST /api/students/ │                       │                │
   │ me/resumes          │                       │                │
   ├────────────────────>│                       │                │
   │                     │                       │                │
   │                     │ Validate file         │                │
   │                     │ (multer)              │                │
   │                     │                       │                │
   │                     │ POST /api/resume/     │                │
   │                     │ analyze               │                │
   │                     ├──────────────────────>│                │
   │                     │                       │                │
   │                     │                       │ Extract text   │
   │                     │                       │ Parse sections │
   │                     │                       │ Extract skills │
   │                     │                       │                │
   │                     │ Parsed data           │                │
   │                     │<──────────────────────│                │
   │                     │                       │                │
   │                     │ Create Resume record  │                │
   │                     ├───────────────────────┼───────────────>│
   │                     │                       │                │
   │ 201 Created         │                       │                │
   │ {resume with skills}│                       │                │
   │<────────────────────│                       │                │
```

### 3. Internship Search with Filters

```
Frontend                Backend                 Database
   │                       │                       │
   │ GET /api/internships  │                       │
   │ ?location=Bangalore   │                       │
   │ &comp=Paid            │                       │
   │ &sort=bestMatch       │                       │
   ├──────────────────────>│                       │
   │                       │                       │
   │                       │ Build filter object   │
   │                       │ {                     │
   │                       │   location: /bangal../i│
   │                       │   compensationType:   │
   │                       │     'Paid',           │
   │                       │   status: 'Open'      │
   │                       │ }                     │
   │                       │                       │
   │                       │ Internship.find()     │
   │                       │ .populate('companyId')│
   │                       │ .sort({aiMatch: -1})  │
   │                       │ .limit(10)            │
   │                       ├──────────────────────>│
   │                       │                       │
   │                       │ Results + pagination  │
   │                       │<──────────────────────│
   │                       │                       │
   │ 200 OK                │                       │
   │ {items: [...],        │                       │
   │  pagination: {...}}   │                       │
   │<──────────────────────│                       │
```

### 4. Application Status Update (Company Portal)

```
Frontend            Backend              Database           Student
   │                   │                     │                │
   │ PATCH /api/       │                     │                │
   │ companies/me/     │                     │                │
   │ applications/:id/ │                     │                │
   │ status            │                     │                │
   │ {status:'Shortlist│                     │                │
   │  ed'}             │                     │                │
   ├──────────────────>│                     │                │
   │                   │                     │                │
   │                   │ Verify company owns │                │
   │                   │ this application    │                │
   │                   │                     │                │
   │                   │ Update status       │                │
   │                   ├────────────────────>│                │
   │                   │                     │                │
   │                   │ Create Notification │                │
   │                   ├────────────────────>│                │
   │                   │                     │                │
   │                   │                     │ New notification│
   │                   │                     ├───────────────>│
   │                   │                     │                │
   │ 200 OK            │                     │                │
   │ {updated app}     │                     │                │
   │<──────────────────│                     │                │
```

## Security Architecture

### Authentication
- **Password Storage**: bcrypt hashing with salt rounds = 10
- **Session Management**: JWT tokens in HTTP-only cookies
- **Token Expiry**: 7 days, refresh not implemented (re-login required)
- **Secure Cookies**: `secure` flag in production, `sameSite: lax`

### Authorization
- **Role-Based Access Control (RBAC)**:
  - Student role: Access to student portal, profile, applications
  - Company role: Access to company portal, manage internships
  - Admin role: Full platform access, user/company management
- **Middleware Chain**: `requireAuth` → `requireRole` → `requireOwnership`
- **Route Protection**: All sensitive routes require authentication

### Input Validation
- **Backend**: Mongoose schema validation + custom validators
- **Frontend**: HTML5 validation + React state validation
- **File Uploads**: Type checking (PDF/DOC/DOCX), size limits (5MB)
- **SQL Injection**: N/A (NoSQL with Mongoose ODM)
- **XSS Prevention**: React auto-escapes JSX, no `dangerouslySetInnerHTML`

### CORS Policy
- Allowed origins: CLIENT_URL + localhost variants
- Credentials: true (cookies sent cross-origin)
- No origin: Allowed (for Postman/curl testing)

## Scalability Considerations

### Current Limitations
- **Single Server**: No horizontal scaling
- **Local File Storage**: Resume files stored on server disk
- **Polling**: No WebSocket for real-time updates
- **No Caching**: Every request hits database

### Improvement Strategies

**1. Horizontal Scaling**
- Use load balancer (NGINX, AWS ALB)
- Stateless backend (JWT in cookies, not sessions)
- Shared MongoDB cluster (Atlas)

**2. File Storage**
- Migrate to cloud storage (AWS S3, Cloudinary)
- Store only URLs in database
- Implement CDN for faster delivery

**3. Caching**
- Redis for:
  - Session storage (if moving away from JWT)
  - API response caching (internship listings)
  - Rate limiting
- MongoDB indexes already optimized

**4. Real-time Features**
- Socket.io for:
  - Live notifications
  - Application status updates
  - Chat between students and companies

**5. Search Optimization**
- Migrate to Elasticsearch for:
  - Full-text search with relevance scoring
  - Faceted search (location, skills, etc.)
  - Autocomplete and suggestions

**6. AI Enhancements**
- Replace TF-IDF with transformer models (BERT, RoBERTa)
- Implement GPU acceleration for AI service
- Cache match scores (invalidate on profile update)
- Batch processing for bulk matching

## Deployment Architecture

### Production Setup

```
┌─────────────────────────────────────────────────────────────┐
│                        CDN (Cloudflare)                      │
│                  Static Assets (JS, CSS, Images)             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Vercel/Netlify)                 │
│               React SPA served from edge network             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTPS/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                Load Balancer (Optional)                      │
└───────────────────────────┬─────────────────────────────────┘
                            │
           ┌────────────────┴────────────────┐
           ▼                                 ▼
┌─────────────────────┐         ┌─────────────────────┐
│  Backend Instance 1 │         │  Backend Instance 2 │
│  (Render/Railway)   │         │  (Render/Railway)   │
└──────────┬──────────┘         └──────────┬──────────┘
           │                               │
           └───────────┬───────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              MongoDB Atlas (Replica Set)                     │
│          Primary + Secondary + Arbiter nodes                 │
└─────────────────────────────────────────────────────────────┘

                       ▲
                       │
                       │ Resume parsing
                       │
┌─────────────────────────────────────────────────────────────┐
│              AI Service (Render Python)                      │
│           FastAPI with spaCy model loaded                    │
└─────────────────────────────────────────────────────────────┘
```

### Environment-Specific Configurations

**Development:**
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173` (Vite dev server)
- AI Service: `http://localhost:8000`
- MongoDB: Local instance or Atlas free tier
- Hot reload enabled
- Detailed error messages
- CORS permissive

**Production:**
- Backend: `https://api.yourdomain.com`
- Frontend: `https://yourdomain.com` (CDN edge)
- AI Service: `https://ai.yourdomain.com`
- MongoDB: Atlas production cluster (M10+)
- Minified bundles
- Generic error messages
- CORS strict
- HTTP-only secure cookies
- Environment secrets in platform vault

## Performance Metrics

### Target Metrics
- **Page Load Time**: < 2 seconds (LCP)
- **API Response Time**: < 200ms (p95)
- **Resume Parsing**: < 3 seconds for 5MB file
- **Match Calculation**: < 1 second for single match
- **Database Queries**: < 50ms with indexes

### Monitoring Recommendations
- **APM**: New Relic, Datadog
- **Logs**: Winston (backend), console (frontend)
- **Uptime**: Pingdom, UptimeRobot
- **Errors**: Sentry for frontend + backend
- **Database**: MongoDB Atlas monitoring

## Future Enhancements

1. **AI/ML Improvements**
   - Deep learning for resume parsing (named entity recognition)
   - Collaborative filtering for recommendations
   - Sentiment analysis on company reviews

2. **Feature Additions**
   - Video interviews (WebRTC)
   - Referral system
   - Skill assessment tests
   - Calendar integration
   - Email/SMS notifications

3. **Technical Debt**
   - Add comprehensive test suites (Jest, Pytest)
   - Implement CI/CD pipeline
   - Add API rate limiting
   - Implement request logging
   - Add Swagger/OpenAPI documentation

4. **Business Logic**
   - Payment gateway for premium listings
   - Company subscription tiers
   - Student portfolio builder
   - Interview preparation resources

---

*This architecture document reflects the current state of the Smart Internship Finder application as of the final integration and hardening pass.*
