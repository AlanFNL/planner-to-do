export interface Task {
  id: string;
  text: string;
  completed: boolean;
  reminder?: Date | null;
  notifyEnabled?: boolean;
} 