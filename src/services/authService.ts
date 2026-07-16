import type { Sex, UserProfile } from '@/domain/user';
import type { Session } from '@/domain/session';
import { findUserByEmail, getUsers, saveUser, saveSession } from '@/storage/repositories';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'my-habits-salt-v1');
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash + data[i]) | 0;
  }
  return hash.toString(16);
}

export interface RegistrationData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  sex: Sex;
  birthDate: string;
}

export interface RegistrationErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  sex?: string;
  birthDate?: string;
  general?: string;
}

export function validateRegistration(
  data: RegistrationData & { confirmPassword: string },
  existingEmails: string[],
): RegistrationErrors {
  const errors: RegistrationErrors & { confirmPassword?: string } = {};

  if (!data.fullName.trim()) {
    errors.fullName = 'Full name is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = 'Enter a valid email address';
  } else if (existingEmails.includes(data.email.trim().toLowerCase())) {
    errors.email = 'An account with this email already exists';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!data.sex) {
    errors.sex = 'Please select an option';
  }

  if (!data.birthDate) {
    errors.birthDate = 'Birth date is required';
  } else {
    const birthDateObj = new Date(data.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDateObj.getFullYear();
    if (age < 13 || age > 120) {
      errors.birthDate = 'You must be at least 13 years old';
    }
  }

  return errors;
}

export async function registerUser(
  data: RegistrationData & { confirmPassword: string },
): Promise<{ user: UserProfile | null; errors: RegistrationErrors }> {
  const users = await getUsers();
  const existingEmails = users.map((u) => u.email.toLowerCase());
  const errors = validateRegistration(data, existingEmails);

  if (Object.keys(errors).length > 0) {
    return { user: null, errors };
  }

  const passwordHash = await hashPassword(data.password);
  const user: UserProfile = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    fullName: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    passwordHash,
    sex: data.sex,
    birthDate: data.birthDate,
    createdAt: new Date().toISOString(),
  };

  await saveUser(user);

  return { user, errors: {} };
}

export interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function validateLogin(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {};

  if (!email.trim()) {
    errors.email = 'Email is required';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return errors;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ session: Session | null; errors: LoginErrors }> {
  const validationErrors = validateLogin(email, password);
  if (Object.keys(validationErrors).length > 0) {
    return { session: null, errors: validationErrors };
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return {
      session: null,
      errors: { general: 'No account found with this email address' },
    };
  }

  const passwordHash = await hashPassword(password);
  if (user.passwordHash !== passwordHash) {
    return {
      session: null,
      errors: { general: 'Incorrect password. Please try again' },
    };
  }

  const session: Session = {
    userId: user.id,
    authenticatedAt: new Date().toISOString(),
  };

  await saveSession(session);

  return { session, errors: {} };
}

export async function logoutUser(): Promise<void> {
  const { clearSession } = await import('@/storage/repositories');
  await clearSession();
}

export async function checkExistingSession(): Promise<UserProfile | null> {
  const { getSession } = await import('@/storage/repositories');
  const session = await getSession();
  if (!session) {
    return null;
  }

  const users = await getUsers();
  return users.find((u) => u.id === session.userId) ?? null;
}
