import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IonButton, IonSpinner } from '@ionic/angular/standalone';
import { map, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '../types/User';

@Component({
  selector: 'app-auth-logout',
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonSpinner
  ],
  template: `
    <div class="relative">
      <div 
        class="ite-main-container flex items-center p-sm"
        [ngClass]="{'ite-user-loading': userIsLoading}"
      >
        <div class="flex-1">
          <div class="text-xs mb-md">Logged-in as:</div>
          <div>{{ userEmail }}</div>
        </div>
        <ion-button
          class="flex-none"
          color="danger"
          size="small"
          (click)="onLogout()"
        >Logout</ion-button>
      </div>
      <div 
        *ngIf="userIsLoading" 
        class="ite-spinner-container absolute flex items-center justify-center" 
        style="height: 100%; width: 100%; top: 0;"
      >
        Loading user... <ion-spinner></ion-spinner>
      </div>
    </div>
  `,
  styles: `
    .ite-main-container.ite-user-loading {
      opacity: 0.2;
    }
  `,
})
export class AuthLogoutComponent {

  // DEPENDENCIES
  authService = inject(AuthService)

  // VARS
  destroy$ = new Subject<void>()

  // TEMPLATE VARS
  userIsLoading = true
  currentUser: User | null = null
  userEmail = this.getUserEmail(null)

  constructor() {
    this.authService.isLoading$.pipe(takeUntil(this.destroy$)).subscribe(isLoading => this.onUserLoadingChange(isLoading))
    this.authService.user$$.pipe(takeUntil(this.destroy$)).subscribe(usr => this.onUserChange(usr))
  }

  // ACTIONS
  ngOnDestroy() {
    this.destroy$.next()
  }

  onUserLoadingChange(isLoading: boolean) {
    this.userIsLoading = isLoading
  }

  onUserChange(user: User | null) {
    this.userEmail = this.getUserEmail(user)
  }

  onLogout = () => {
    this.authService.logout()
  }

  // UTILS
  private getUserEmail(user: User | null): string {
    return user === null ? 'No logged-in user...' : user.email
  }

}