import { Router } from 'express';
import {
  createBoard,
  getBoard,
  addListToBoard,
  addTaskToList,
  updateBoard,
  deleteBoard,
  updateList,
  deleteList,
  updateTask,
  deleteTask,
} from '../controllers/boardController';

const router = Router();

router.post('/boards', createBoard);
router.get('/boards/:id', getBoard);
router.post('/boards/:id/lists', addListToBoard);
router.post('/lists/:id/tasks', addTaskToList);

router.put('/boards/:id', updateBoard);
router.delete('/boards/:id', deleteBoard);
router.put('/lists/:id', updateList);
router.delete('/lists/:id', deleteList);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

export default router;
