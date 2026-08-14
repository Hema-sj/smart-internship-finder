import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import healthRouter from './routes/healthRoutes.js';
import connectDatabase from './config/database.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/health', healthRouter);

const port = process.env.PORT || 5000;
connectDatabase().finally(() => app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`)));
