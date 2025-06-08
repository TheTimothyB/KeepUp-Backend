import { Request, Response } from 'express';
import { boards, Board, TaskList, Task } from '../models/ProjectBoard';

let boardIdCounter = 1;
let listIdCounter = 1;
let taskIdCounter = 1;

export const createBoard = (req: Request, res: Response): void => {
  const { name } = req.body as { name?: string };
  if (!name) {
    res.status(400).json({ error: 'Name required' });
    return;
  }
  const board: Board = { id: boardIdCounter++, name, lists: [] };
  boards.push(board);
  res.status(201).json(board);
};

export const getBoard = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const board = boards.find((b) => b.id === id);
  if (!board) {
    res.status(404).json({ error: 'Board not found' });
    return;
  }
  res.json(board);
};

export const updateBoard = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const board = boards.find((b) => b.id === id);
  if (!board) {
    res.status(404).json({ error: 'Board not found' });
    return;
  }
  board.name = req.body.name ?? board.name;
  res.json(board);
};

export const deleteBoard = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const index = boards.findIndex((b) => b.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Board not found' });
    return;
  }
  boards.splice(index, 1);
  res.status(204).send();
};

export const addListToBoard = (req: Request, res: Response): void => {
  const boardId = Number(req.params.id);
  const board = boards.find((b) => b.id === boardId);
  if (!board) {
    res.status(404).json({ error: 'Board not found' });
    return;
  }
  const { name } = req.body as { name?: string };
  if (!name) {
    res.status(400).json({ error: 'Name required' });
    return;
  }
  const list: TaskList = { id: listIdCounter++, name, boardId, tasks: [] };
  board.lists.push(list);
  res.status(201).json(list);
};

export const updateList = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  for (const board of boards) {
    const list = board.lists.find((l) => l.id === id);
    if (list) {
      list.name = req.body.name ?? list.name;
      res.json(list);
      return;
    }
  }
  res.status(404).json({ error: 'List not found' });
};

export const deleteList = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  for (const board of boards) {
    const index = board.lists.findIndex((l) => l.id === id);
    if (index !== -1) {
      board.lists.splice(index, 1);
      res.status(204).send();
      return;
    }
  }
  res.status(404).json({ error: 'List not found' });
};

export const addTaskToList = (req: Request, res: Response): void => {
  const listId = Number(req.params.id);
  for (const board of boards) {
    const list = board.lists.find((l) => l.id === listId);
    if (list) {
      const { title, description } = req.body as { title?: string; description?: string };
      if (!title) {
        res.status(400).json({ error: 'Title required' });
        return;
      }
      const task: Task = { id: taskIdCounter++, title, description, listId };
      list.tasks.push(task);
      res.status(201).json(task);
      return;
    }
  }
  res.status(404).json({ error: 'List not found' });
};

export const updateTask = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  for (const board of boards) {
    for (const list of board.lists) {
      const task = list.tasks.find((t) => t.id === id);
      if (task) {
        task.title = req.body.title ?? task.title;
        task.description = req.body.description ?? task.description;
        res.json(task);
        return;
      }
    }
  }
  res.status(404).json({ error: 'Task not found' });
};

export const deleteTask = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  for (const board of boards) {
    for (const list of board.lists) {
      const index = list.tasks.findIndex((t) => t.id === id);
      if (index !== -1) {
        list.tasks.splice(index, 1);
        res.status(204).send();
        return;
      }
    }
  }
  res.status(404).json({ error: 'Task not found' });
};
