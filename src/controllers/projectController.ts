import { Request, Response } from 'express';
import {
  categories,
  projects,
  getOrCreateDefaultCategory,
  Project,
  ProjectCategory,
} from '../models/Project';

let categoryCounter = 1;
let projectCounter = 1;

export const createCategory = (req: Request, res: Response): void => {
  const { name, accountId } = req.body as { name?: string; accountId?: number };
  if (!name || !accountId) {
    res.status(400).json({ error: 'Name and accountId required' });
    return;
  }
  const category: ProjectCategory = {
    id: categoryCounter++,
    name,
    accountId,
    createdAt: new Date(),
  };
  categories.push(category);
  res.status(201).json(category);
};

export const listCategories = (req: Request, res: Response) => {
  const accountId = Number(req.query.accountId);
  const result = Number.isNaN(accountId)
    ? categories
    : categories.filter((c) => c.accountId === accountId);
  res.json(result);
};

export const updateCategory = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const category = categories.find((c) => c.id === id);
  if (!category) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  category.name = req.body.name ?? category.name;
  res.json(category);
};

export const deleteCategory = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  categories.splice(index, 1);
  projects.forEach((p) => {
    if (p.categoryId === id) {
      p.categoryId = undefined;
    }
  });
  res.status(204).send();
};

export const createProject = (req: Request, res: Response): void => {
  const { name, accountId, companyId, categoryId } = req.body as {
    name?: string;
    accountId?: number;
    companyId?: number;
    categoryId?: number;
  };
  if (!name || !accountId || !companyId) {
    res.status(400).json({ error: 'Name, accountId and companyId required' });
    return;
  }
  let catId = categoryId;
  if (!catId) {
    const defaultCat = getOrCreateDefaultCategory(accountId);
    catId = defaultCat.id;
  }
  const project: Project = {
    id: projectCounter++,
    name,
    accountId,
    companyId,
    createdAt: new Date(),
    categoryId: catId,
  };
  projects.push(project);
  res.status(201).json(project);
};

export const getProject = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const project = projects.find((p) => p.id === id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json(project);
};

export const updateProject = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const project = projects.find((p) => p.id === id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  project.name = req.body.name ?? project.name;
  res.json(project);
};
