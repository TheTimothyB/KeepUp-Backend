// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requireAdmin } from './middleware/requireAdmin';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health-check route
app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

// Example protected admin route
app.get('/admin', requireAdmin, (_req, res) => {
  res.status(200).json({ message: 'Admin access granted' });
});

// Start
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`KeepUp backend listening on port ${port}`);
});
