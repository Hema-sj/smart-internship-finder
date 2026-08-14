import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import healthRouter from './routes/healthRoutes.js';
import authRouter from './routes/authRoutes.js';
import internshipRouter from './routes/internshipRoutes.js';
import connectDatabase from './config/database.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/internships', internshipRouter);
app.use((error, _request, response, _next) => { console.error(error); response.status(500).json({ message: 'Something went wrong.' }); });

const port = process.env.PORT || 5000;
connectDatabase().finally(() => app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`)));
