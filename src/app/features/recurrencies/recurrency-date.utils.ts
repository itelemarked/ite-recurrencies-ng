import { RecurrencySchedule } from './recurrency.types';

export function getNextDueDate({ lastEvent, periodNb, periodUnit }: RecurrencySchedule): Date {
  const next = new Date(lastEvent);

  switch (periodUnit) {
    case 'day':
      next.setDate(next.getDate() + periodNb);
      break;
    case 'week':
      next.setDate(next.getDate() + periodNb * 7);
      break;
    case 'month':
      next.setMonth(next.getMonth() + periodNb);
      break;
    case 'year':
      next.setFullYear(next.getFullYear() + periodNb);
      break;
  }

  return next;
}

export function isOverdue(schedule: RecurrencySchedule, referenceDate = new Date()): boolean {
  return getNextDueDate(schedule).getTime() < referenceDate.getTime();
}
