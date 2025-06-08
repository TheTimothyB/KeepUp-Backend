export interface UserProjectAccess {
  userId: number;
  projectId: number;
  role?: string; // e.g., viewer/editor
}

export const userProjectAccess: UserProjectAccess[] = [];
