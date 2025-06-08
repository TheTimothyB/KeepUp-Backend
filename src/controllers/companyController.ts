import { Request, Response } from 'express';
import { companies, userCompanies, Company, UserCompany } from '../models/Company';
import { projects } from '../models/Project';

let companyCounter = 1;

export const createCompany = (req: Request, res: Response) => {
  const { name, accountId, isMasterCompany } = req.body as {
    name?: string;
    accountId?: number;
    isMasterCompany?: boolean;
  };
  if (!name || !accountId) {
    return res.status(400).json({ error: 'name and accountId required' });
  }
  if (
    isMasterCompany &&
    companies.some((c) => c.accountId === accountId && c.isMasterCompany)
  ) {
    return res.status(400).json({ error: 'Master company already exists' });
  }
  const company: Company = {
    id: companyCounter++,
    name,
    accountId,
    isMasterCompany: Boolean(isMasterCompany),
    createdAt: new Date(),
  };
  companies.push(company);
  res.status(201).json(company);
};

export const assignUsersToCompany = (req: Request, res: Response) => {
  const companyId = Number(req.params.id);
  const { userIds, role } = req.body as { userIds?: number[]; role?: string };
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ error: 'userIds required' });
  }
  const company = companies.find((c) => c.id === companyId);
  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }
  userIds.forEach((userId) => {
    const existing = userCompanies.find(
      (uc) => uc.userId === userId && uc.companyId === companyId
    );
    if (existing) {
      existing.role = role;
    } else {
      const uc: UserCompany = { userId, companyId, role };
      userCompanies.push(uc);
    }
  });
  res.json({ success: true });
};

export const getCompany = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const company = companies.find((c) => c.id === id);
  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }
  const users = userCompanies
    .filter((uc) => uc.companyId === id)
    .map((uc) => ({ userId: uc.userId, role: uc.role }));
  const companyProjects = projects.filter((p) => p.companyId === id);
  res.json({ ...company, users, projects: companyProjects });
};
