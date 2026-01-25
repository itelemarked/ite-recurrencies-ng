import { Component, computed, inject } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { NgFor, NgIf } from "@angular/common";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AuthFirebaseService } from "./auth-firebase.service";
import { catchError, fromEvent, map, of, retry, Subject, tap } from "rxjs";

@Component({
  selector: 'app-testing-user-service',
  standalone: true,
  imports: [
    IonButton,
],
  template: `
    <!-- <p>user: {{ userInfo() }}</p>
    <p>status: {{ statusInfo() }}</p>
    <p>error message: {{ errorMessage() }}</p>
    <ion-button size="small" (click)="authService.login('ccc@ccc.com', '3333333')">wrong</ion-button>
    <ion-button size="small" (click)="authService.login('aaa@aaa.com', '111111')">aaa</ion-button>
    <ion-button size="small" (click)="authService.login('ccc@ccc.com', '333333')">ccc</ion-button> -->
    <!-- <ion-button size="small" (click)="authService.logout()">logout</ion-button> -->
  `,
  styles: [``]
})
export class TestingUserServiceComponent {
  
  // authService = inject(AuthFirebaseService)

  // private fbAuth = inject(AngularFireAuth)

  // userInfo = computed(() => {
  //   const data = this.authService.userData()
  //   if (data.status === 'loading') return 'user-loading'
  //   if (data.status === 'error') return 'mmmhhh... some error occured for user...'
  //   return data.value === null ? 'user-not-authenticated' : data.value.email
  // })

  // statusInfo = computed(() => {
  //   const data = this.authService.userData()
  //   return data.status
  // })

  // errorMessage = computed(() => {
  //   const data = this.authService.userData()
  //   return data.status === 'error' ? data.error : 'no-errors'
  // })

}