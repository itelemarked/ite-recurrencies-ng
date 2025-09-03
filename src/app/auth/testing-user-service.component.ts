import { Component, computed, inject } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { NgFor, NgIf } from "@angular/common";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AuthServiceFirebase } from "./auth-service-firebase";
import { catchError, fromEvent, map, of, retry, Subject, tap } from "rxjs";

@Component({
  selector: 'app-testing-user-service',
  standalone: true,
  imports: [
    IonButton,
    NgFor,
    NgIf
],
  template: `
    <p>user: {{ userInfo() }}</p>
    <p>status: {{ statusInfo() }}</p>
    <p>error message: {{ errorMessage() }}</p>
    <ion-button size="small" (click)="login('ccc@ccc.com', '3333333')">wrong</ion-button>
    <ion-button size="small" (click)="login('aaa@aaa.com', '111111')">aaa</ion-button>
    <ion-button size="small" (click)="login('ccc@ccc.com', '333333')">ccc</ion-button>
    <!-- <ion-button size="small" (click)="loginCCC()">ccc</ion-button> -->
    <ion-button size="small" (click)="logout()">logout</ion-button>
  `,
  styles: [``]
})
export class TestingUserServiceComponent {
  
  authService = inject(AuthServiceFirebase)

  private fbAuth = inject(AngularFireAuth)

  userInfo = computed(() => {
    const state = this.authService.state()
    if (state.user === null) return 'null'
    if (state.user === undefined) return 'undefined'
    return state.user.email
  })

  statusInfo = computed(() => {
    const state = this.authService.state()
    return state.status
  })

  errorMessage = computed(() => {
    const state = this.authService.state()
    return state.error === null ? 'null' : state.error
  })

  login = (email: string, password: string) => this.authService.login(email, password)
  logout = () => this.authService.logout()

  loginCCC = () => {
    this.fbAuth.signInWithEmailAndPassword('ccc@ccc.com', '333333')
    .then(console.log)
    .catch(console.warn)
  }
}