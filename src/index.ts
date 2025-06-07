// src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health-check route
app.get('/health', (req: Request, res: Response) => {
  return res.status(200).send('OK');
});

// Start
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`KeepUp backend listening on port ${port}`);
});
