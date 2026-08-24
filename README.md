# Smart Internship Finder

A full-stack web application that helps engineering students discover and apply for internships with AI-powered resume analysis, skill gap detection, and intelligent matching.

## 🎯 Features

### For Students
- **AI Resume Parser**: Upload PDF/DOCX resumes for automatic skill extraction
- **Smart Matching**: AI-powered match percentage for every internship based on your profile
- **Skill Gap Analysis**: Identify missing skills and get learning resource recommendations
- **Advanced Search**: Filter by location, course, compensation, certificate type, and more
- **Application Tracking**: Monitor application status from submission to selection
- **Save & Bookmark**: Keep track of interesting opportunities
- **Real-time Notifications**: Get notified about application updates

### For Companies
- **Post Internships**: Create detailed internship listings with skill requirements
- **Application Management**: Review student applications and update status
- **Company Profile**: Showcase your organization to attract top talent
- **Admin Verification**: Verified badge after admin approval

### For Administrators
- **Dashboard Analytics**: View platform statistics with Recharts visualizations
- **Company Verification**: Approve or reject company registrations
- **Content Moderation**: Manage internships, users, and applications
- **Review Management**: Oversee company reviews and ratings

## 🏗️ Architecture

The application consists of three independent services:

```
smart-internship-finder/
├── frontend/          # React + Vite + Tailwind CSS
├── backend/           # Node.js + Express + MongoDB
└── ai-service/        # Python + FastAPI + spaCy + scikit-learn
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+ with pip
- **MongoDB** 5.0+ (local or MongoDB Atlas)
- **uv** (optional, for AI service): [Installation guide](https://docs.astral.sh/uv/getting-started/installation/)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd smart-internship-finder
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and configure:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smart_internship_finder
JWT_SECRET=your_secure_random_secret_here_at_least_32_chars
CLIENT_URL=http://localhost:5173
AI_SERVICE_URL=http://localhost:8000
```

Start the server:

```bash
npm start
```

Backend runs at `http://localhost:5000`

### 3. Setup AI Service

```bash
cd ai-service
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Download spaCy language model
python -m spacy download en_core_web_sm
```

Configure environment (optional):

```bash
cp .env.example .env
```

Start the service:

```bash
uvicorn main:app --reload --port 8000
```

AI service runs at `http://localhost:8000`

### 4. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_AI_SERVICE_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

### 5. Seed Database (Optional)

```bash
cd backend
node scripts/seedInternships.js
```

## 📝 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `5000` |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | Yes | - |
| `CLIENT_URL` | Frontend URL for CORS | No | `http://localhost:5173` |
| `AI_SERVICE_URL` | AI service endpoint | No | `http://localhost:8000` |
| `NODE_ENV` | Environment (`development` / `production`) | No | `development` |

### Frontend (`frontend/.env`)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API base URL | No | `http://localhost:5000/api` |
| `VITE_AI_SERVICE_URL` | AI service URL (unused in current setup) | No | `http://localhost:8000` |

### AI Service (`ai-service/.env`)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `AI_SERVICE_PORT` | Service port | No | `8000` |
| `MODEL_LANGUAGE` | spaCy model language | No | `en` |

## 🔗 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Student registration
- `POST /login` - Student login
- `POST /company/register` - Company registration
- `POST /company/login` - Company login
- `POST /admin/login` - Admin login
- `GET /me` - Get current user
- `POST /logout` - Logout

### Internships (`/api/internships`)
- `GET /` - List all internships (with filters)
- `GET /:id` - Get internship details
- `GET /paid` - List paid internships
- `GET /unpaid` - List unpaid internships
- `GET /courses` - Get available courses
- `GET /stats` - Get internship statistics

### Students (`/api/students`)
- `GET /me/profile` - Get my profile
- `PUT /me/profile` - Update profile
- `GET /me/applications` - Get my applications
- `POST /me/applications` - Apply to internship
- `DELETE /me/applications/:id` - Withdraw application
- `GET /me/saved` - Get saved internships
- `POST /me/saved` - Save internship
- `DELETE /me/saved/:id` - Unsave internship
- `GET /me/resumes` - Get uploaded resumes
- `POST /me/resumes` - Upload resume (multipart/form-data)
- `DELETE /me/resumes/:id` - Delete resume
- `GET /me/notifications` - Get notifications
- `PATCH /me/notifications/:id/read` - Mark notification as read
- `PATCH /me/notifications/read-all` - Mark all as read

### Companies (`/api/companies/me`)
- `GET /` - Get my company profile
- `PUT /` - Update company profile
- `GET /internships` - Get my internships
- `POST /internships` - Create internship
- `PUT /internships/:id` - Update internship
- `DELETE /internships/:id` - Delete internship
- `GET /internships/:id/applications` - Get applications
- `PATCH /applications/:id/status` - Update application status

### Admin (`/api/admin`)
- `GET /stats` - Dashboard statistics
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `DELETE /users/:id` - Delete user
- `GET /companies` - List companies
- `PATCH /companies/:id/verify` - Verify/unverify company
- `GET /internships` - List all internships
- `PATCH /internships/:id/status` - Update internship status
- `DELETE /internships/:id` - Delete internship
- `GET /applications` - List all applications

### AI Service (`/api`)
- `POST /resume/analyze` - Parse resume (PDF/DOCX)
- `POST /skills/extract` - Extract skills from text
- `POST /match` - Calculate match score
- `POST /match/batch` - Batch match scoring
- `POST /match/skills` - Skill gap analysis

## 🧪 Testing

### Backend
```bash
cd backend
node scripts/testRoutes.js
```

### Frontend
Build for production:
```bash
cd frontend
npm run build
npm run preview
```

### AI Service
Test health endpoint:
```bash
curl http://localhost:8000/health
```

Test resume parsing:
```bash
curl -X POST http://localhost:8000/api/resume/analyze \
  -F "file=@/path/to/resume.pdf"
```

## 📦 Deployment

### Backend (Render / Railway / Heroku)

1. Set environment variables in platform dashboard
2. Ensure `MONGODB_URI` points to cloud MongoDB (Atlas recommended)
3. Set `NODE_ENV=production`
4. Deploy from Git repository
5. Build command: `npm install`
6. Start command: `npm start`

### Frontend (Vercel / Netlify)

1. Set `VITE_API_URL` to your deployed backend URL
2. Build command: `npm run build`
3. Output directory: `dist`
4. Deploy from Git repository

### AI Service (Render Python / Railway)

1. Runtime: Python 3.10+
2. Build command: `pip install -r requirements.txt && python -m spacy download en_core_web_sm`
3. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Set environment variable `PORT` (auto-provided by most platforms)

### Database (MongoDB Atlas)

1. Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Add IP whitelist: `0.0.0.0/0` (allow all) or specific IPs
3. Create database user
4. Get connection string and set as `MONGODB_URI`

## 🗂️ Project Structure

### Frontend
```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # React Context (Auth)
│   ├── data/            # Static data (locations, etc.)
│   ├── layouts/         # Page layouts (App, Dashboard)
│   ├── pages/           # Route pages
│   ├── services/        # API client functions
│   ├── utils/           # Helper functions
│   ├── App.jsx          # Route definitions
│   ├── main.jsx         # App entry point
│   └── index.css        # Tailwind CSS
├── public/              # Static assets
└── package.json
```

### Backend
```
backend/
├── config/              # Database connection
├── constants/           # Enums (locations, compensation)
├── controllers/         # Request handlers
├── middleware/          # Auth & role guards
├── models/              # Mongoose schemas
├── routes/              # Express routes
├── scripts/             # Seed & migration scripts
├── services/            # Business logic
├── uploads/             # File uploads (resumes)
├── utils/               # Helpers (token)
└── server.js            # Express app entry
```

### AI Service
```
ai-service/
├── app/
│   ├── models/          # Data models (currently empty)
│   ├── services/        # AI logic
│   │   ├── resume_parser.py    # PDF/DOCX extraction
│   │   ├── skill_extractor.py  # NLP skill detection
│   │   └── matcher.py          # TF-IDF matching
│   ├── utils/           # Helpers
│   └── routes.py        # FastAPI endpoints
├── main.py              # FastAPI app entry
└── requirements.txt
```

## 🔒 Security Notes

- **JWT Secret**: Use a strong, random secret (min 32 characters) in production
- **Password Hashing**: bcrypt with salt rounds = 10
- **File Upload**: Limited to 5MB, PDF/DOC/DOCX only
- **CORS**: Configured for allowed origins only
- **Environment Files**: Never commit `.env` files to version control

## 🛠️ Known Limitations

1. **AI Matching**: Currently uses TF-IDF cosine similarity. Can be enhanced with deep learning models.
2. **Resume Storage**: Files stored locally. Use cloud storage (S3, Cloudinary) for production.
3. **Real-time Updates**: Polling-based. Consider WebSockets for live notifications.
4. **Company Portal**: Basic implementation - can be expanded with analytics dashboard.
5. **Admin Portal**: Minimal UI - consider adding comprehensive management tools.
6. **Mobile App**: Web-only. Consider React Native for mobile platforms.
7. **Email Notifications**: Not implemented. Integrate SendGrid/Mailgun for email alerts.
8. **Search**: Basic MongoDB text search. Consider Elasticsearch for advanced search.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Built with** ❤️ **using React, Node.js, Express, MongoDB, FastAPI, and spaCy**
