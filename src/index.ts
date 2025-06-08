// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requireAdmin } from './middleware/requireAdmin';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import boardRoutes from './routes/boards';
import projectRoutes from './routes/projects';
dotenv.config();

const app = express();
let prisma: PrismaClient;
if (process.env.NODE_ENV !== 'test') {
  prisma = new PrismaClient();
} else {
  prisma = {} as PrismaClient;
}
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Middleware
app.use(cors());
app.use(express.json());
app.use(boardRoutes);
app.use(projectRoutes);

// Register new user
app.post('/auth/register', async (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return res.status(409).json({ error: 'Username already exists' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { username, password: hashed } });
  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ token });
});

// Login existing user
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ token });
});

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
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`KeepUp backend listening on port ${port}`);
  });
}

export default app;
