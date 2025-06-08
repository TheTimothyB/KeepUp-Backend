export interface Task {
  id: number;
  title: string;
  description?: string;
  listId: number;
}

export interface TaskList {
  id: number;
  name: string;
  boardId: number;
  tasks: Task[];
}

export interface Board {
  id: number;
  name: string;
  lists: TaskList[];
}

// In-memory store used by controllers during early development.
export const boards: Board[] = [];
