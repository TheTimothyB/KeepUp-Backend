import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userProjectAccess } from '../models/UserProjectAccess';
import { UserRole } from '../roles';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export function authorizeProjectAccess(projectIdParamKey: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authorization required' });
      return;
    }
    try {
      const token = auth.split(' ')[1];
      const payload = jwt.verify(token, JWT_SECRET) as any;
      const userId = payload.userId as number | undefined;
      const role = payload.role as UserRole | undefined;
      if (!userId) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }
      (req as any).userId = userId;
      (req as any).userRole = role;
      if (role === UserRole.ADMIN) {
        next();
        return;
      }
      const projectId = Number(req.params[projectIdParamKey]);
      if (
        userProjectAccess.some(
          (a) => a.userId === userId && a.projectId === projectId
        )
      ) {
        next();
        return;
      }
      res.status(403).json({ error: 'Forbidden' });
      return;
    } catch {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
  };
}
