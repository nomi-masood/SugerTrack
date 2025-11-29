export type Unit = 'mg/dL' | 'mmol/L';

export enum TimeCategory {
  BEFORE_BREAKFAST = 'Before Breakfast',
  AFTER_BREAKFAST = 'After Breakfast',
  BEFORE_LUNCH = 'Before Lunch',
  AFTER_LUNCH = 'After Lunch',
  BEFORE_DINNER = 'Before Dinner',
  AFTER_DINNER = 'After Dinner',
  BEFORE_SLEEP = 'Before Sleep',
  AFTER_SLEEP = 'After Sleep',
  OTHER = 'Other'
}

export interface SugarRecord {
  id: string;
  timestamp: number;
  category: TimeCategory;
  value: number; // Stored as the value entered
  unit: Unit;    // The unit used when entered
  notes: string;
}

export interface AppState {
  records: SugarRecord[];
  addRecord: (record: Omit<SugarRecord, 'id'>) => void;
  updateRecord: (record: SugarRecord) => void;
  deleteRecord: (id: string) => void;
  deleteRecords: (ids: string[]) => void;
  importData: (jsonString: string) => boolean;
  exportData: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  defaultUnit: Unit;
  setDefaultUnit: (unit: Unit) => void;
}