# Smart Internship Finder

An engineering-student-focused internship platform with independently runnable React, Express, and FastAPI services.

## Services

| Service | Folder | Default URL | Health endpoint |
| --- | --- | --- | --- |
| Frontend | `frontend` | `http://localhost:5173` | — |
| Backend API | `backend` | `http://localhost:5000` | `/api/health` |
| AI service | `ai-service` | `http://localhost:8000` | `/health` |

## Run locally

1. Configure env files by copying each `.env.example` to `.env` in `frontend` and `backend`.
2. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Start the backend in a separate terminal (MongoDB must be reachable):
   ```bash
   cd backend
   npm install
   npm run dev
   ```
4. Start the AI service in another terminal:
   ```bash
   cd ai-service
   python -m venv .venv
   .venv\\Scripts\\activate
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

This phase provides the project foundations and health checks only. Feature APIs, authentication flows, and AI matching are intentionally left for later phases.
An AI-powered platform that helps students find suitable internships based on their skills, interests, and career goals.
