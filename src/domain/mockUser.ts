import type { UserProfile } from '@/domain/user';

export const mockUser: UserProfile = {
  id: 'user-demo-1',
  fullName: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  passwordHash: 'demo-password-hash',
  sex: 'preferNotToSay',
  birthDate: '1990-01-15',
  createdAt: '2026-07-14T10:00:00.000Z',
};
