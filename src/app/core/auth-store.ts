import { computed, Injectable } from '@angular/core';
import { ADAPTERS } from './adapters';
import { AuthInterface } from './auth-types';

@Injectable({ providedIn: 'root' })
export class AuthStore implements AuthInterface {
  private readonly adapter = ADAPTERS.auth();

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
