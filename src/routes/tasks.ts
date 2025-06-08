import { Router } from 'express';
import { createTask, getTask } from '../controllers/taskController';

const router = Router();

router.post('/tasks', createTask);
router.get('/tasks/:taskId', getTask);

export default router;
