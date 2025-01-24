import { Component, computed, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-auth-logout',
  standalone: true,
  imports: [
    IonButton
  ],
  template: `
    <div class="flex items-center p-sm">
      <div class="flex-1">
        <div class="text-xs mb-md">Logged-in as:</div>
        <div>{{ userEmail }}</div>
      </div>
      <ion-button
        class="flex-none"
        color="danger"
        (click)="onLogout()"
      >logout</ion-button>
    </div>
  `,
  styles: ``,
})
export class AuthLogoutComponent {

  // DEPENDENCIES
  userService = inject(UserService)

  // TEMPLATE VARS
  userEmail: string = this.userService.currentUser?.email === undefined ? '' : this.userService.currentUser.email

  // TEMPLATE ACTIONS
  onLogout = () => {
    this.userService.logout()
      .then(_ => console.log('logout successful'))
      .catch(err => console.log('logout unsuccessful...'))
  }

  constructor() {
    this.userService.user$$.subscribe(usr => {
      this.userEmail = usr === null ? '' : usr.email
    })
  }

}