import { Router } from 'express';
import {
  createCompany,
  assignUsersToCompany,
  getCompany,
} from '../controllers/companyController';
import { requireAdmin } from '../middleware/requireAdmin';

const router = Router();

router.post('/companies', requireAdmin, createCompany);
router.post('/companies/:id/users', requireAdmin, assignUsersToCompany);
router.get('/companies/:id', getCompany);

export default router;
