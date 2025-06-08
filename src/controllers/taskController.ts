import { Request, Response } from 'express';
import { tasks, Task } from '../models/Task';
import { timeLogs, TimeLog } from '../models/TimeLog';
import { tags as tagStore, Tag } from '../models/Tag';
import { comments, Comment } from '../models/Comment';
import { followers, Follower } from '../models/Follower';
import {
  repeatSettings,
  RepeatSetting,
  RepeatPattern,
} from '../models/RepeatSetting';

let idCounter = 1;
let timeLogCounter = 1;
let tagIdCounter = 1;

function generateShortId() {
  return Math.random().toString(36).substring(2, 8);
}

export const createTask = (req: Request, res: Response): void => {
  const { name, description, startDate, dueDate, priority, assignedUserIds } =
    req.body as Partial<
      Omit<Task, 'id' | 'taskId' | 'createdAt' | 'updatedAt'>
    > & {
      assignedUserIds?: number[];
    };

  if (!name) {
    res.status(400).json({ error: 'Name required' });
    return;
  }
  if (assignedUserIds && !Array.isArray(assignedUserIds)) {
    res.status(400).json({ error: 'assignedUserIds must be an array' });
    return;
  }

  let parsedStart: Date | undefined;
  if (startDate) {
    parsedStart = new Date(startDate);
    if (isNaN(parsedStart.getTime())) {
      res.status(400).json({ error: 'Invalid startDate' });
      return;
    }
  }

  let parsedDue: Date | undefined;
  if (dueDate) {
    parsedDue = new Date(dueDate);
    if (isNaN(parsedDue.getTime())) {
      res.status(400).json({ error: 'Invalid dueDate' });
      return;
    }
  }

  if (priority && !['LOW', 'MEDIUM', 'HIGH'].includes(priority)) {
    res.status(400).json({ error: 'Invalid priority' });
    return;
  }

  const now = new Date();
  const task: Task = {
    id: idCounter++,
    taskId: generateShortId(),
    name,
    description,
    startDate: parsedStart,
    dueDate: parsedDue,
    priority: (priority as Task['priority']) || 'MEDIUM',
    createdAt: now,
    updatedAt: now,
    assignedUserIds: assignedUserIds || [],
    progress: 0,
    tagIds: [],
  };
  tasks.push(task);
  res.status(201).json(task);
};

export const getTask = (req: Request, res: Response): void => {
  const { taskId } = req.params;
  const task = tasks.find((t) => t.taskId === taskId);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.json(task);
};

export const logTime = (req: Request, res: Response): void => {
  const { taskId } = req.params;
  const task = tasks.find((t) => t.taskId === taskId);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  const { start, end } = req.body as { start?: string; end?: string };
  if (!start || !end) {
    res.status(400).json({ error: 'start and end required' });
    return;
  }
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    res.status(400).json({ error: 'Invalid dates' });
    return;
  }
  if (endDate <= startDate) {
    res.status(400).json({ error: 'end must be after start' });
    return;
  }
  const totalMs = endDate.getTime() - startDate.getTime();
  const log: TimeLog = {
    id: timeLogCounter++,
    taskId,
    start: startDate,
    end: endDate,
    totalMs,
  };
  timeLogs.push(log);
  res.status(201).json(log);
};

export const updateProgress = (req: Request, res: Response): void => {
  const { taskId } = req.params;
  const task = tasks.find((t) => t.taskId === taskId);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  const { progress } = req.body as { progress?: number };
  if (typeof progress !== 'number' || progress < 0 || progress > 100) {
    res.status(400).json({ error: 'progress must be 0-100' });
    return;
  }
  task.progress = progress;
  task.updatedAt = new Date();
  res.json(task);
};

export const createTag = (req: Request, res: Response): void => {
  const { name } = req.body as { name?: string };
  if (!name) {
    res.status(400).json({ error: 'Name required' });
    return;
  }
  const tag: Tag = { id: tagIdCounter++, name };
  tagStore.push(tag);
  res.status(201).json(tag);
};

export const updateTaskTags = (req: Request, res: Response): void => {
  const { taskId } = req.params;
  const task = tasks.find((t) => t.taskId === taskId);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  const { tagIds } = req.body as { tagIds?: number[] };
  if (!Array.isArray(tagIds)) {
    res.status(400).json({ error: 'tagIds must be array' });
    return;
  }
  task.tagIds = tagIds;
  task.updatedAt = new Date();
  res.json(task);
};

let commentIdCounter = 1;

export const addComment = (req: Request, res: Response): void => {
  const { taskId } = req.params;
  const task = tasks.find((t) => t.taskId === taskId);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  const { text, userId } = req.body as { text?: string; userId?: number };
  if (!text || typeof userId !== 'number') {
    res.status(400).json({ error: 'text and userId required' });
    return;
  }
  const mentions = text.match(/@\w+/g)?.map((m) => m.substring(1)) || [];
  const comment: Comment = {
    id: commentIdCounter++,
    taskId,
    userId,
    text,
    createdAt: new Date(),
    mentions,
  };
  comments.push(comment);
  followers
    .filter((f) => f.taskId === taskId)
    .forEach((f) => console.log(`Notify follower ${f.userId} about comment`));
  mentions.forEach((m) => console.log(`Notify mentioned user ${m}`));
  res.status(201).json(comment);
};

export const getComments = (req: Request, res: Response): void => {
  const { taskId } = req.params;
  const task = tasks.find((t) => t.taskId === taskId);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.json(comments.filter((c) => c.taskId === taskId));
};

export const toggleFollow = (req: Request, res: Response): void => {
  const { taskId } = req.params;
  const task = tasks.find((t) => t.taskId === taskId);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  const { userId } = req.body as { userId?: number };
  if (typeof userId !== 'number') {
    res.status(400).json({ error: 'userId required' });
    return;
  }
  const idx = followers.findIndex(
    (f) => f.taskId === taskId && f.userId === userId
  );
  if (idx !== -1) {
    followers.splice(idx, 1);
    res.json({ following: false });
    return;
  } else {
    const follower: Follower = { taskId, userId };
    followers.push(follower);
    res.json({ following: true });
    return;
  }
};

export const setRepeat = (req: Request, res: Response): void => {
  const { taskId } = req.params;
  const task = tasks.find((t) => t.taskId === taskId);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  const { pattern } = req.body as { pattern?: RepeatPattern };
  if (!pattern || !['DAILY', 'WEEKLY'].includes(pattern)) {
    res.status(400).json({ error: 'Invalid pattern' });
    return;
  }
  let setting = repeatSettings.find((r) => r.taskId === taskId);
  if (!setting) {
    setting = { taskId, pattern } as RepeatSetting;
    repeatSettings.push(setting);
  } else {
    setting.pattern = pattern;
  }
  res.status(201).json(setting);
};

function addInterval(date: Date, pattern: RepeatPattern) {
  const day = 24 * 60 * 60 * 1000;
  const inc = pattern === 'DAILY' ? day : 7 * day;
  return new Date(date.getTime() + inc);
}

export const processRepeats = () => {
  const now = new Date();
  for (const setting of repeatSettings) {
    const task = tasks.find((t) => t.taskId === setting.taskId);
    if (!task || !task.dueDate) continue;
    if (task.dueDate <= now && setting.lastGenerated !== task.dueDate) {
      const newTask: Task = {
        ...task,
        id: idCounter++,
        taskId: generateShortId(),
        createdAt: now,
        updatedAt: now,
        startDate: task.startDate
          ? addInterval(task.startDate, setting.pattern)
          : undefined,
        dueDate: addInterval(task.dueDate, setting.pattern),
      };
      tasks.push(newTask);
      setting.taskId = newTask.taskId;
      setting.lastGenerated = task.dueDate;
    }
  }
};

export const processRepeatsHandler = (_req: Request, res: Response): void => {
  processRepeats();
  res.json({ count: tasks.length });
};
