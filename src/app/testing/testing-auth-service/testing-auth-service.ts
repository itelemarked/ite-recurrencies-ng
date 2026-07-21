import { Component, inject } from "@angular/core";
import { IonicModule } from '@ionic/angular';
import { AuthService } from "../../auth/services/auth-service3";

@Component({
  selector: 'app-testing-auth-service',
  imports: [
    IonicModule
  ],
  template: `
    <div class="p-1">
      <ion-button
        size="small"
        (click)="authService.login('aaa@aaa.com', '111111')"
      >login aaa</ion-button>
    </div>
    <div class="p-1">
      <ion-button
        size="small"
        (click)="authService.login('aaa@aa.com', '111111')"
      >wrong email</ion-button>
    </div>
    <div class="p-1">
      <ion-button
        size="small"
        (click)="authService.login('aaa@aaa.com', '1')"
      >wrong password (for aaa@aaa.com)</ion-button>
    </div>
    <div class="p-1">
      <ion-button
        size="small"
        (click)="authService.signup('aaa@aaa.com', '123456')"
      >wrong signup (already existing aaa@aaa.com)</ion-button>
    </div>
    <div class="p-1">
      <ion-button
        size="small"
        (click)="authService.login('bbb@bbb.com', '222222')"
      >login bbb</ion-button>
    </div>
    <div class="p-1">
      <ion-button
        size="small"
        (click)="authService.signup('ccc@ccc.com', '333333')"
      >signup ccc</ion-button>
    </div>
    <div class="p-1">
      <ion-button
        size="small"
        (click)="authService.logout()"
      >logout</ion-button>
    </div>
    <div class="p-1">
      user: {{ !!user()? user()!.email : 'no user logged-in' }} <br>
      isLoading: {{ userIsLoading() }} <br>
      error: {{ !!userError() ? userError()!.message : 'no errors' }}
    </div>
  `,
  styles: [``]
})
export class TestingAuthService {
  authService = inject(AuthService)
  
  user$ = this.authService.user$
  userIsLoading$ = this.authService.isLoading$
  userError$ = this.authService.error$
  user = this.authService.user
  userIsLoading = this.authService.isLoading
  userError = this.authService.error

}