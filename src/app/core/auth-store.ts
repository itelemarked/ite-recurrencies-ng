import { computed, Injectable } from '@angular/core';
import { AuthInterface } from './auth-types';
import { createFirebaseAuth } from './firebase-adapter/firebase-auth';
import { createMockAuth } from './mock-adapter/mock-auth';

const ADAPTERS = {
  firebase: createFirebaseAuth,
  mock: createMockAuth,
};

const ACTIVE_ADAPTER = ADAPTERS['mock'];

@Injectable({ providedIn: 'root' })
export class AuthStore implements AuthInterface {
  private readonly adapter = ACTIVE_ADAPTER();

  readonly user = this.adapter.user;
  readonly isLoading = this.adapter.isLoading;
  readonly error = this.adapter.error;

  readonly isAuthenticated = computed(() => !!this.user());
  readonly isInitialized = computed(() => this.user() !== undefined);

  login(email: string, password: string): void {
    this.adapter.login(email, password);
  }

  signup(email: string, password: string): void {
    this.adapter.signup(email, password);
  }

  logout(): void {
    this.adapter.logout();
  }
}
