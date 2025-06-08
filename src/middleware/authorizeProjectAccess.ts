import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userProjectAccess } from '../models/UserProjectAccess';
import { UserRole } from '../roles';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export function authorizeProjectAccess(projectIdParamKey: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization required' });
    }
    try {
      const token = auth.split(' ')[1];
      const payload = jwt.verify(token, JWT_SECRET) as any;
      const userId = payload.userId as number | undefined;
      const role = payload.role as UserRole | undefined;
      if (!userId) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      (req as any).userId = userId;
      (req as any).userRole = role;
      if (role === UserRole.ADMIN) {
        return next();
      }
      const projectId = Number(req.params[projectIdParamKey]);
      if (
        userProjectAccess.some(
          (a) => a.userId === userId && a.projectId === projectId
        )
      ) {
        return next();
      }
      return res.status(403).json({ error: 'Forbidden' });
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}
