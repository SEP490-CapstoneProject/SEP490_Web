export interface MockUser {
  email: string;
  password: string;
  role: string;
}

export const mockLoginAccounts: MockUser[] = [
  {
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    email: 'moderator@gmail.com',
    password: 'moderator123',
    role: 'company',
  },
  {
    email: 'user@gmail.com',
    password: 'user123',
    role: 'user',
  },
  {
    email: 'recruiter@gmail.com',
    password: 'recruiter123',
    role: 'recruiter',
  },
];
