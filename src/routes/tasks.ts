import { Router } from 'express';
import {
  createTask,
  getTask,
  logTime,
  updateProgress,
  createTag,
  updateTaskTags,
} from '../controllers/taskController';

const router = Router();

router.post('/tasks', createTask);
router.get('/tasks/:taskId', getTask);
router.post('/tasks/:taskId/timelogs', logTime);
router.patch('/tasks/:taskId/progress', updateProgress);
router.patch('/tasks/:taskId/tags', updateTaskTags);
router.post('/tags', createTag);

export default router;
