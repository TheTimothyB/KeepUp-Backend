export interface Company {
  id: number;
  name: string;
  accountId: number;
  isMasterCompany: boolean;
  createdAt: Date;
}

export interface UserCompany {
  userId: number;
  companyId: number;
  role?: string;
}

export const companies: Company[] = [];
export const userCompanies: UserCompany[] = [];
