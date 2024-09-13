import { Component } from '@angular/core';
import {
  IonButton,
} from '@ionic/angular/standalone';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth-logout',
  standalone: true,
  imports: [
    IonButton,
  ],
  template: `
    <div class="centered">
      Logged in as: ** user.email **
    </div>

    <div>
      <ion-button
        class="ion-padding-top"
        expand="block"
        fill="outline"
        color="danger"
        (click)="auth.logout()"
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
  
  constructor(public auth: AuthService) {}
}