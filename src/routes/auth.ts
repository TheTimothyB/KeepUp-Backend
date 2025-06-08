import { Router } from 'express';
import { createAccount, registerUser } from '../controllers/authController';

const router = Router();

router.post('/accounts', createAccount);
router.post('/accounts/:accountId/users', registerUser);

export default router;
