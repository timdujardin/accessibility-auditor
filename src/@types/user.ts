export type UserRole = 'auditor' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  organization: string;
  role: UserRole;
  createdAt: string;
}
