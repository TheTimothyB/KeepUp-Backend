export interface Comment {
  id: number;
  taskId: string;
  userId: number;
  text: string;
  createdAt: Date;
  mentions: string[];
}

export const comments: Comment[] = [];
