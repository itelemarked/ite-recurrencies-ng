import {
  NewRecurrency,
  NewRecurrencyData,
  PERIOD_UNITS,
  PeriodUnit,
  Recurrency,
  RecurrencyChanges,
  RecurrencyData,
  RecurrencyDataChanges,
} from './recurrency.types';

export function isValidPeriodUnit(value: unknown): value is PeriodUnit {
  return typeof value === 'string' && PERIOD_UNITS.includes(value as PeriodUnit);
}

export function isValidRecurrencyData(data: unknown): data is RecurrencyData {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const candidate = data as Record<string, unknown>;

  return (
    typeof candidate['id'] === 'string' &&
    candidate['id'].trim().length > 0 &&
    typeof candidate['title'] === 'string' &&
    candidate['title'].trim().length > 0 &&
    typeof candidate['lastEvent'] === 'string' &&
    !Number.isNaN(Date.parse(candidate['lastEvent'])) &&
    typeof candidate['periodNb'] === 'number' &&
    Number.isFinite(candidate['periodNb']) &&
    candidate['periodNb'] > 0 &&
    isValidPeriodUnit(candidate['periodUnit']) &&
    typeof candidate['category'] === 'string'
  );
}

export function toNewRecurrency(data: NewRecurrencyData): NewRecurrency {
  if (!isValidPeriodUnit(data.periodUnit)) {
    throw new Error(`Invalid periodUnit: ${data.periodUnit}`);
  }

  const lastEvent = new Date(data.lastEvent);
  if (Number.isNaN(lastEvent.getTime())) {
    throw new Error(`Invalid lastEvent date: ${data.lastEvent}`);
  }

  return {
    title: data.title,
    lastEvent,
    periodNb: data.periodNb,
    periodUnit: data.periodUnit,
    category: data.category,
  };
}

export function toRecurrency(data: RecurrencyData): Recurrency {
  return {
    id: data.id,
    ...toNewRecurrency(data),
  };
}

export function toRecurrencyData(model: NewRecurrency): NewRecurrencyData {
  if (Number.isNaN(model.lastEvent.getTime())) {
    throw new Error('Invalid lastEvent date');
  }
  if (!model.title.trim() || model.periodNb <= 0) {
    throw new Error('Invalid recurrency values');
  }

  return {
    title: model.title.trim(),
    lastEvent: model.lastEvent.toISOString(),
    periodNb: model.periodNb,
    periodUnit: model.periodUnit,
    category: model.category.trim(),
  };
}

export function toPartialRecurrencyData(changes: RecurrencyChanges): RecurrencyDataChanges {
  const { lastEvent, title, category, ...rest } = changes;

  if (lastEvent !== undefined && Number.isNaN(lastEvent.getTime())) {
    throw new Error('Invalid lastEvent date');
  }

  return {
    ...rest,
    ...(title !== undefined && { title: title.trim() }),
    ...(category !== undefined && { category: category.trim() }),
    ...(lastEvent !== undefined && { lastEvent: lastEvent.toISOString() }),
  };
}
