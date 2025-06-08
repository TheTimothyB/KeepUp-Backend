import { Router } from 'express';
import {
  createCategory,
  listCategories,
  updateCategory,
  deleteCategory,
  createProject,
  getProject,
  updateProject,
} from '../controllers/projectController';
import { authorizeProjectAccess } from '../middleware/authorizeProjectAccess';

const router = Router();

router.post('/categories', createCategory);
router.get('/categories', listCategories);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.post('/projects', createProject);
router.get('/projects/:id', authorizeProjectAccess('id'), getProject);
router.patch('/projects/:id', authorizeProjectAccess('id'), updateProject);

export default router;
