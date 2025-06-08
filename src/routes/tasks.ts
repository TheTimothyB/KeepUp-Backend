import { Router } from 'express';
import {
  createTask,
  getTask,
  logTime,
  updateProgress,
  createTag,
  updateTaskTags,
  addComment,
  getComments,
  toggleFollow,
  setRepeat,
  processRepeatsHandler,
} from '../controllers/taskController';

const router = Router();

router.post('/tasks', createTask);
router.get('/tasks/:taskId', getTask);
router.post('/tasks/:taskId/timelogs', logTime);
router.patch('/tasks/:taskId/progress', updateProgress);
router.patch('/tasks/:taskId/tags', updateTaskTags);
router.post('/tags', createTag);
router.post('/tasks/:taskId/comments', addComment);
router.get('/tasks/:taskId/comments', getComments);
router.post('/tasks/:taskId/followers', toggleFollow);
router.post('/tasks/:taskId/repeat', setRepeat);
router.post('/tasks/process-repeats', processRepeatsHandler);

export default router;
