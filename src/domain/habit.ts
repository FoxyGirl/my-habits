export interface Habit {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  completionDates: string[];
  archived: boolean;
}
