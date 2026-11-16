import { RecurrencyDateUtils } from './recurrency.types';

export const getNextDueDate: RecurrencyDateUtils['getNextDueDate'] = ({
  lastEvent,
  periodNb,
  periodUnit,
}) => {
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
};

export const isOverdue: RecurrencyDateUtils['isOverdue'] = (
  schedule,
  referenceDate = new Date()
) => {
  return getNextDueDate(schedule).getTime() < referenceDate.getTime();
};
