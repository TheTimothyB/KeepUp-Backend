import { Router } from 'express';
import {
  createCategory,
  listCategories,
  updateCategory,
  deleteCategory,
  createProject,
} from '../controllers/projectController';

const router = Router();

router.post('/categories', createCategory);
router.get('/categories', listCategories);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.post('/projects', createProject);

export default router;
