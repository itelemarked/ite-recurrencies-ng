import { Component, computed, inject } from "@angular/core";
import { IonicModule } from '@ionic/angular';
import { AuthService } from "../../core/services/auth-service";
import { AuthService2 } from "../../core/services/auth-service2";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: 'app-testing-auth-service',
  imports: [
    IonicModule,
    AsyncPipe
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
      >wrong login</ion-button>
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
      error: {{ !!userError() ? userError() : 'no errors' }}
    </div>
  `,
  styles: [``]
})
export class TestingAuthService {
  authService = inject(AuthService2)

  // user = computed(() => this.authService.user()) 
  // userIsLoading = computed(() => this.authService.isLoading()) 
  // userError = computed(() => this.authService.error()) 
  
  user$ = this.authService.user$
  userIsLoading$ = this.authService.isLoading$
  userError$ = this.authService.error$
  user = this.authService.user
  userIsLoading = this.authService.isLoading
  userError = this.authService.error

}