export interface Task {
  id: number;
  taskId: string;
  name: string;
  description?: string;
  startDate?: Date;
  dueDate?: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: Date;
  updatedAt: Date;
  assignedUserIds: number[];
}

export const tasks: Task[] = [];
