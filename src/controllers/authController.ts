import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { accounts, Account } from '../models/Account';
import { users, User } from '../models/User';
import { companies, Company } from '../models/Company';
import { UserRole } from '../roles';

let accountCounter = 1;
let userCounter = 1;

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const createAccount = (req: Request, res: Response) => {
  const { name, createMasterCompany } = req.body as {
    name?: string;
    createMasterCompany?: boolean;
  };
  if (!name) {
    return res.status(400).json({ error: 'name required' });
  }
  if (accounts.some((a) => a.name === name)) {
    return res.status(400).json({ error: 'Account name already exists' });
  }
  const account: Account = {
    id: accountCounter++,
    name,
    createdAt: new Date(),
  };
  accounts.push(account);

  if (createMasterCompany) {
    const company: Company = {
      id: companies.length + 1,
      name: `${name} Master`,
      accountId: account.id,
      isMasterCompany: true,
      createdAt: new Date(),
    };
    companies.push(company);
  }

  res.status(201).json(account);
};

export const registerUser = async (req: Request, res: Response) => {
  const accountId = Number(req.params.accountId);
  const { username, password, role } = req.body as {
    username?: string;
    password?: string;
    role?: UserRole;
  };
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password required' });
  }
  const account = accounts.find((a) => a.id === accountId);
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }
  if (users.some((u) => u.username === username && u.accountId === accountId)) {
    return res.status(409).json({ error: 'Username already exists' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user: User = {
    id: userCounter++,
    username,
    password: hashed,
    role: role || UserRole.BASIC,
    accountId,
    createdAt: new Date(),
  };
  users.push(user);

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
  res.status(201).json({ token });
};
