export type Sex = 'female' | 'male' | 'nonBinary' | 'preferNotToSay';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  sex: Sex;
  birthDate: string;
  createdAt: string;
}
