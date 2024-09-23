import { Component, computed } from '@angular/core';
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
      Logged in as: {{ userEmail$() }}
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

  // TEMPLATE VARS:
  // userEmail$ = this.auth.user$.pipe(map(res => !!res ? res.email : ''))
  userEmail$ = computed(() => this.auth.user$())
  
  constructor(public auth: AuthService) {}
}