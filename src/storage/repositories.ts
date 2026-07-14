import type { Habit } from '@/domain/habit';
import type { Session } from '@/domain/session';
import type { Sex, UserProfile } from '@/domain/user';
import { isDateString, today } from '@/utils/date';
import { normalizeCompletionDates } from '@/utils/streak';

import { storage } from './storage';
import { storageKeys } from './storageKeys';

export interface SuggestionHistoryEntry {
  id: string;
  goal: string;
  suggestions: string[];
  createdAt: string;
  source: 'remote' | 'local';
}

type Validator<T> = (value: unknown) => value is T;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isUserProfile(value: unknown): value is UserProfile {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.fullName === 'string' &&
    typeof value.email === 'string' &&
    typeof value.passwordHash === 'string' &&
    isSex(value.sex) &&
    isDateString(value.birthDate) &&
    typeof value.createdAt === 'string'
  );
}

function isSex(value: unknown): value is Sex {
  return (
    value === 'female' ||
    value === 'male' ||
    value === 'nonBinary' ||
    value === 'preferNotToSay'
  );
}

function isHabit(value: unknown): value is Habit {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.description === 'string' &&
    typeof value.createdAt === 'string' &&
    Array.isArray(value.completionDates) &&
    value.completionDates.every(isDateString) &&
    typeof value.archived === 'boolean'
  );
}

function isSession(value: unknown): value is Session {
  return (
    isRecord(value) &&
    typeof value.userId === 'string' &&
    typeof value.authenticatedAt === 'string'
  );
}

function isSuggestionHistoryEntry(value: unknown): value is SuggestionHistoryEntry {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.goal === 'string' &&
    Array.isArray(value.suggestions) &&
    value.suggestions.every((suggestion) => typeof suggestion === 'string') &&
    typeof value.createdAt === 'string' &&
    (value.source === 'remote' || value.source === 'local')
  );
}

async function readValue<T>(key: string, validator: Validator<T>, fallback: T): Promise<T> {
  try {
    const rawValue = await storage.getItem(key);
    if (rawValue === null) {
      return fallback;
    }

    const parsedValue: unknown = JSON.parse(rawValue);
    return validator(parsedValue) ? parsedValue : fallback;
  } catch {
    return fallback;
  }
}

async function writeValue<T>(key: string, value: T): Promise<void> {
  await storage.setItem(key, JSON.stringify(value));
}

function isUserProfileList(value: unknown): value is UserProfile[] {
  return Array.isArray(value) && value.every(isUserProfile);
}

function isHabitList(value: unknown): value is Habit[] {
  return Array.isArray(value) && value.every(isHabit);
}

function isSuggestionHistoryList(value: unknown): value is SuggestionHistoryEntry[] {
  return Array.isArray(value) && value.every(isSuggestionHistoryEntry);
}

export async function getUsers(): Promise<UserProfile[]> {
  return readValue(storageKeys.users, isUserProfileList, []);
}

export async function saveUser(user: UserProfile): Promise<void> {
  const users = await getUsers();
  const existingIndex = users.findIndex((existingUser) => existingUser.id === user.id);
  const nextUsers = [...users];

  if (existingIndex === -1) {
    nextUsers.push(user);
  } else {
    nextUsers[existingIndex] = user;
  }

  await writeValue(storageKeys.users, nextUsers);
}

export async function findUserByEmail(email: string): Promise<UserProfile | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await getUsers();

  return users.find((user) => user.email.trim().toLowerCase() === normalizedEmail) ?? null;
}

export async function getSession(): Promise<Session | null> {
  return readValue<Session | null>(
    storageKeys.session,
    (value): value is Session | null => value === null || isSession(value),
    null,
  );
}

export async function saveSession(session: Session): Promise<void> {
  await writeValue(storageKeys.session, session);
}

export async function clearSession(): Promise<void> {
  await storage.removeItem(storageKeys.session);
}

export async function getHabits(): Promise<Habit[]> {
  return readValue(storageKeys.habits, isHabitList, []);
}

export async function saveHabit(habit: Habit): Promise<void> {
  const habits = await getHabits();
  const existingIndex = habits.findIndex((existingHabit) => existingHabit.id === habit.id);
  const nextHabits = [...habits];

  if (existingIndex === -1) {
    nextHabits.push({ ...habit, completionDates: normalizeCompletionDates(habit.completionDates) });
  } else {
    nextHabits[existingIndex] = {
      ...habit,
      completionDates: normalizeCompletionDates(habit.completionDates),
    };
  }

  await writeValue(storageKeys.habits, nextHabits);
}

export async function deleteHabit(habitId: string): Promise<void> {
  const habits = await getHabits();
  await writeValue(
    storageKeys.habits,
    habits.filter((habit) => habit.id !== habitId),
  );
}

export async function completeHabit(habitId: string, date: string = today()): Promise<Habit | null> {
  if (!isDateString(date)) {
    throw new Error(`Invalid completion date: ${date}`);
  }

  const habits = await getHabits();
  const habit = habits.find((candidate) => candidate.id === habitId);
  if (!habit) {
    return null;
  }

  const updatedHabit: Habit = {
    ...habit,
    completionDates: normalizeCompletionDates([...habit.completionDates, date]),
  };
  await saveHabit(updatedHabit);

  return updatedHabit;
}

export async function getSuggestionHistory(): Promise<SuggestionHistoryEntry[]> {
  return readValue(storageKeys.suggestionHistory, isSuggestionHistoryList, []);
}

export async function saveSuggestionHistoryEntry(
  entry: SuggestionHistoryEntry,
): Promise<void> {
  const history = await getSuggestionHistory();
  await writeValue(storageKeys.suggestionHistory, [...history, entry]);
}
