
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../../services/auth.service';


@Component({
  selector: 'app-user-service-check',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
    <div>user email: {{this.authService.user()?.email }}</div>
    <div>user is loading: {{this.authService.isLoading() }}</div>
    <div>user is logged-in: {{this.authService.isLoggedIn() }}</div>
    <div>user is logged-out: {{this.authService.isLoggedOut() }}</div>
  `,
  styles: `
    :host {
      display: block;
      margin: 10px 0;
    }
  `,
})
export class UserServiceCheckComponent {

  authService = inject(AuthService)

  constructor() {
    this.TEST()
  }

  private TEST() {
  }

}