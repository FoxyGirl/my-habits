import { addDays, isDateString, today } from '@/utils/date';

export function normalizeCompletionDates(completionDates: readonly string[]): string[] {
  return [...new Set(completionDates.filter(isDateString))].sort();
}

export function calculateCurrentStreak(
  completionDates: readonly string[],
  referenceDate: string = today(),
): number {
  if (!isDateString(referenceDate)) {
    throw new Error(`Invalid reference date: ${referenceDate}`);
  }

  const completedDates = new Set(normalizeCompletionDates(completionDates));
  let streakDate = completedDates.has(referenceDate) ? referenceDate : addDays(referenceDate, -1);
  let streak = 0;

  while (completedDates.has(streakDate)) {
    streak += 1;
    streakDate = addDays(streakDate, -1);
  }

  return streak;
}
