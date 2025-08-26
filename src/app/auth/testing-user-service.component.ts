import { Component, computed, inject } from "@angular/core";
import { AuthServiceFirebase } from "./auth-service-firebase";
import { IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-testing-user-service',
  standalone: true,
  imports: [
    IonButton
  ],
  template: `
    <p>user: {{ userInfo() }}</p>
    <ion-button size="small" (click)="login('aaa@aaa.com', '111111')">aaa</ion-button>
    <ion-button size="small" (click)="login('bbb@bbb.com', '222222')">bbb</ion-button>
    <ion-button size="small" (click)="logout()">logout</ion-button>
  `,
  styles: [``]
})
export class TestingUserServiceComponent {
  
  authService = inject(AuthServiceFirebase)

  userInfo = computed(() => {
    const user = this.authService.user()
    if (user === null) return 'null'
    if (user === undefined) return 'undefined'
    return user.email
  })

  login(email: string, password: string) {
    this.authService.login(email, password)
  }

  logout() {
    this.authService.logout()
  }
}