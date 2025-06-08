export interface TimeLog {
  id: number;
  taskId: string;
  start: Date;
  end: Date;
  totalMs: number;
}

export const timeLogs: TimeLog[] = [];
