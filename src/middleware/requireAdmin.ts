import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../roles';

// Simple placeholder middleware to restrict routes to admins.
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  // In the future, extract user role from authentication token
  const role = (req as any).userRole as UserRole | undefined;
  if (role === UserRole.ADMIN) {
    return next();
  }
  return res.status(403).json({ message: 'Admin access required' });
}
