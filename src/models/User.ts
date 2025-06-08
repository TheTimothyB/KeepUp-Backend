import { UserRole } from '../roles';

export interface User {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  accountId: number;
  createdAt: Date;
}

export const users: User[] = [];
