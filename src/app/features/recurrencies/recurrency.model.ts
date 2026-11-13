import { Identifiable } from "@core/data-types";


export const PERIOD_UNITS = ['day', 'month', 'year'] as const;
export type PeriodUnit = (typeof PERIOD_UNITS)[number];

export interface Recurrency {
  title: string;
  lastEvent: string;
  periodNb: number;
  periodUnit: PeriodUnit;
  category: string;
}

export type IdentifiableRecurrency = Identifiable<Recurrency>;

export function isValidRecurrency(data: unknown): data is Recurrency {
  if (typeof data !== 'object' || data === null) return false;
  const candidate = data as Record<string, unknown>;

  return (
    typeof candidate['title'] === 'string' &&
    typeof candidate['lastEvent'] === 'string' &&
    typeof candidate['periodNb'] === 'number' &&
    Number.isInteger(candidate['periodNb']) &&
    candidate['periodNb'] > 0 &&
    typeof candidate['periodUnit'] === 'string' &&
    (PERIOD_UNITS as readonly string[]).includes(candidate['periodUnit']) &&
    typeof candidate['category'] === 'string'
  );
}
