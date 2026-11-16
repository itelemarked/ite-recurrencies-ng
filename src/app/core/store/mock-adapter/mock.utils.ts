import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MOCK_AUTH_DATA, MOCK_STORE_DATA } from './mock.config';

/**
 * In-memory stand-in for the backend. Each injector (the app, or each test bed) gets its own
 * deep copy of the seed data. Every write calls notify(), so all active mock listeners
 * re-read, like Firestore listeners.
 */
@Injectable({ providedIn: 'root' })
export class MockDatabase {
  readonly store: Record<string, unknown> = structuredClone(MOCK_STORE_DATA);
  readonly auth: Record<string, unknown> = structuredClone(MOCK_AUTH_DATA);

  private readonly changes = new Subject<void>();
  readonly changes$ = this.changes.asObservable();

  notify(): void {
    this.changes.next();
  }
}

/** Mirrors Firestore's ignoreUndefinedProperties: undefined = "not provided". */
export function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(stripUndefined) as T;
  }

  if (value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, stripUndefined(v)]),
    ) as T;
  }

  return value;
}
