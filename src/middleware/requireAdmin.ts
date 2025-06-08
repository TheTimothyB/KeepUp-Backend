import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../roles';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Simple placeholder middleware to restrict routes to admins.
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  let role = (req as any).userRole as UserRole | undefined;
  if (!role) {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      try {
        const payload = jwt.verify(auth.split(' ')[1], JWT_SECRET) as any;
        role = payload.role as UserRole | undefined;
        (req as any).userRole = role;
      } catch {
        // ignore
      }
    }
  }
  if (role === UserRole.ADMIN) {
    return next();
  }
  return res.status(403).json({ message: 'Admin access required' });
}
