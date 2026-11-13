import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MOCK_AUTH_DATA } from './mock-auth-data';
import { MOCK_STORE_DATA } from './mock-store-data';

/**
 * In-memory stand-in for the backend. Each injector (the app, or each TestBed)
 * gets its own deep copy of the seed data, so the seed constants are never mutated.
 * Every write calls notify(), so all active mock listeners re-read, like Firestore listeners.
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