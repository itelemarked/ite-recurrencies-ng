import { Component, computed, inject } from '@angular/core';
import {
  IonButton,
} from '@ionic/angular/standalone';
import { AuthService } from './auth.service';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-logout',
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
  ],
  template: `
    <div class="centered">
      Logged in as: *** email ***
    </div>

    <div>
      <ion-button
        class="ion-padding-top"
        expand="block"
        fill="outline"
        color="danger"
        (click)="onLogout()"
      >logout</ion-button>
    </div>
  `,
  styles: `

    ion-button {
      --border-radius: 5px;
    }

    .centered {
      text-align: center;
    }

  `,
})
export class AuthLogoutComponent {

  authService = inject(AuthService)

  onLogout() {
    this.authService.logout()
  }
}