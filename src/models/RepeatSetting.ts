export type RepeatPattern = 'DAILY' | 'WEEKLY';

export interface RepeatSetting {
  taskId: string;
  pattern: RepeatPattern;
  lastGenerated?: Date;
}

export const repeatSettings: RepeatSetting[] = [];
