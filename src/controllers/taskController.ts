import { Request, Response } from 'express';
import { tasks, Task } from '../models/Task';

let idCounter = 1;

function generateShortId() {
  return Math.random().toString(36).substring(2, 8);
}

export const createTask = (req: Request, res: Response) => {
  const { name, description, startDate, dueDate, priority, assignedUserIds } =
    req.body as Partial<Omit<Task, 'id' | 'taskId' | 'createdAt' | 'updatedAt'>> & {
      assignedUserIds?: number[];
    };

  if (!name) {
    return res.status(400).json({ error: 'Name required' });
  }
  if (assignedUserIds && !Array.isArray(assignedUserIds)) {
    return res.status(400).json({ error: 'assignedUserIds must be an array' });
  }

  const now = new Date();
  const task: Task = {
    id: idCounter++,
    taskId: generateShortId(),
    name,
    description,
    startDate: startDate ? new Date(startDate) : undefined,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    priority: (priority as Task['priority']) || 'MEDIUM',
    createdAt: now,
    updatedAt: now,
    assignedUserIds: assignedUserIds || [],
  };
  tasks.push(task);
  res.status(201).json(task);
};

export const getTask = (req: Request, res: Response) => {
  const { taskId } = req.params;
  const task = tasks.find((t) => t.taskId === taskId);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
};
