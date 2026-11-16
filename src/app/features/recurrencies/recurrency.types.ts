export const PERIOD_UNITS = ['day', 'week', 'month', 'year'] as const;
export type PeriodUnit = (typeof PERIOD_UNITS)[number];

export interface RecurrencyData {
  id: string;
  title: string;
  lastEvent: string;
  periodNb: number;
  periodUnit: string;
  category: string;
}

export interface Recurrency {
  id: string;
  title: string;
  lastEvent: Date;
  periodNb: number;
  periodUnit: PeriodUnit;
  category: string;
}

export type NewRecurrencyData = Omit<RecurrencyData, 'id'>;
export type NewRecurrency = Omit<Recurrency, 'id'>;
export type RecurrencyChanges = Partial<NewRecurrency>;
export type RecurrencyDataChanges = Partial<NewRecurrencyData>;

export type RecurrencySchedule = Pick<Recurrency, 'lastEvent' | 'periodNb' | 'periodUnit'>;

export interface RecurrencyDateUtils {
  getNextDueDate: (schedule: RecurrencySchedule) => Date;
  isOverdue: (schedule: RecurrencySchedule, referenceDate?: Date) => boolean;
}
