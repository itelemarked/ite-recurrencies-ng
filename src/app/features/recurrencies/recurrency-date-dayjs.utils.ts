import dayjs from 'dayjs';
import { RecurrencyDateUtils } from './recurrency.types';

export const getNextDueDate: RecurrencyDateUtils['getNextDueDate'] = ({
  lastEvent,
  periodNb,
  periodUnit,
}) => {
  return dayjs(lastEvent).add(periodNb, periodUnit).toDate();
};

export const isOverdue: RecurrencyDateUtils['isOverdue'] = (
  schedule,
  referenceDate = new Date()
) => {
  return dayjs(getNextDueDate(schedule)).isBefore(referenceDate, 'day');
};
