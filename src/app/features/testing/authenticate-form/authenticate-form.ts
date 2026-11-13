import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthStore } from '@core/auth-store';

@Component({
  selector: 'app-authenticate-form',
  imports: [IonicModule],
  template: `
    <div class="ion-margin-top">
      <ion-item class="ion-margin-bottom">
        <ion-input
          type="email"
          label="Email"
          labelPlacement="stacked"
          fill="outline"
          [value]="email()"
          (ionInput)="email.set($event.detail.value ?? '')"
        />
      </ion-item>

      <ion-item>
        <ion-input
          type="password"
          label="Password"
          labelPlacement="stacked"
          fill="outline"
          [value]="password()"
          (ionInput)="password.set($any($event).detail.value ?? '')"
        />
      </ion-item>
    </div>

    <div class="ion-margin-top" style="font-size: 0.8em;">
      <div>isLoading: {{ authStore.isLoading() }}</div>
      <div>user: {{ userDisplay() }}</div>
      <div class="ion-text-wrap">error: {{ errorDisplay() }}</div>
    </div>

    <div class="ion-margin-top">
      <ion-button class="ion-padding-horizontal" size="small" (click)="onLogin()"> Login </ion-button>
      <ion-button class="ion-padding-horizontal" size="small" (click)="onLogin('aaa')"> Login aaa</ion-button>
      <ion-button class="ion-padding-horizontal" size="small" (click)="onLogin('bbb')"> Login bbb</ion-button>
      <ion-button class="ion-padding-horizontal" fill="outline" size="small" (click)="onSignup()"> Signup </ion-button>
      <ion-button class="ion-padding-horizontal" color="danger" size="small" (click)="onLogout()"> Logout </ion-button>
    </div>
  `,
})
export class AuthenticateFormComponent {
  protected readonly authStore = inject(AuthStore);

  protected readonly email = signal('');
  protected readonly password = signal('');

  protected readonly userDisplay = computed(() => {
    const currentUser = this.authStore.user();
    if (currentUser === undefined) return 'undefined (initializing...)';
    if (currentUser === null) return 'null';
    return currentUser.email ?? '(no email)';
  });

  protected readonly errorDisplay = computed(() => {
    const err = this.authStore.error();
    return err ? `${err.code} - ${err.details}` : 'null';
  });

  protected onLogin(user?: 'aaa'|'bbb'): void {
    if(user === undefined) {
      this.authStore.login(this.email(), this.password());
    } else if(user === 'aaa') {
      this.authStore.login('aaa@aaa.com', '111111')
    } else {
      this.authStore.login('bbb@bbb.com', '222222')
    }
  }

  protected onSignup(): void {
    this.authStore.signup(this.email(), this.password());
  }

  protected onLogout(): void {
    this.authStore.logout();
  }
}
