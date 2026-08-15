import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

import connectDatabase    from './config/database.js';
import healthRouter       from './routes/healthRoutes.js';
import authRouter         from './routes/authRoutes.js';
import internshipRouter   from './routes/internshipRoutes.js';
import studentRouter      from './routes/studentRoutes.js';
import companyRouter      from './routes/companyRoutes.js';
import adminRouter        from './routes/adminRoutes.js';
import reviewRouter       from './routes/reviewRoutes.js';
import resourceRouter     from './routes/resourceRoutes.js';

const __dirname     = dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIST = join(__dirname, '..', 'frontend', 'dist');

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5000',   // same-origin production
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));


// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/health',       healthRouter);
app.use('/api/auth',         authRouter);
app.use('/api/internships',  internshipRouter);
app.use('/api/students',     studentRouter);
app.use('/api/companies/me', companyRouter);
app.use('/api/admin',        adminRouter);
app.use('/api/reviews',      reviewRouter);
app.use('/api/resources',    resourceRouter);

// ─── Serve built React frontend — AFTER API routes ─────────────────────────
app.use(express.static(FRONTEND_DIST));

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((error, _request, response, _next) => {
  console.error('[ERROR]', error.message, error.stack?.split('\n')[1]?.trim());
  response.status(error.status || 500).json({ message: error.message || 'Something went wrong.' });
});

// ─── SPA fallback — serve index.html for all non-API routes ──────────────────
app.use((_request, response) => {
  response.sendFile(join(FRONTEND_DIST, 'index.html'));
});

// ─── Start ────────────────────────────────────────────────────────────────────
const port = process.env.PORT || 5000;
connectDatabase().finally(() =>
  app.listen(port, () => {
    console.log(`\n🚀 Smart Internship Finder`);
    console.log(`   App:     http://localhost:${port}`);
    console.log(`   API:     http://localhost:${port}/api`);
    console.log(`   Health:  http://localhost:${port}/api/health\n`);
  })
);
