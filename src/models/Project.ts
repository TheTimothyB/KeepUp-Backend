export interface ProjectCategory {
  id: number;
  name: string;
  accountId: number;
  createdAt: Date;
}

export interface Project {
  id: number;
  name: string;
  accountId: number;
  createdAt: Date;
  categoryId?: number;
}

export const categories: ProjectCategory[] = [];
export const projects: Project[] = [];

export function getOrCreateDefaultCategory(accountId: number): ProjectCategory {
  let cat = categories.find(
    (c) => c.accountId === accountId && c.name === 'Uncategorized'
  );
  if (!cat) {
    cat = {
      id: categories.length + 1,
      name: 'Uncategorized',
      accountId,
      createdAt: new Date(),
    };
    categories.push(cat);
  }
  return cat;
}
