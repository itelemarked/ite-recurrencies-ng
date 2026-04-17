import { Component, computed, inject } from "@angular/core";
import { AlertController, IonicModule } from '@ionic/angular';
import { LoginForm } from "./login-form";
import { UserFirebaseService } from "../../recurrencies/services/user-firebase-service";

@Component({
  selector: 'app-testing-user-settings-recurrency-services',
  imports: [
    IonicModule,
    LoginForm
  ],
  template: `
    <app-login-form
      (login)="onLogin($event)"
    />
    <ion-loading [isOpen]="isLoading()" [style.--background]="'transparent'"></ion-loading>
  `,
  styles: [``]
})
export class TestingUserSettingsRecurrencyServices {
  // DEPENDENCIES
  userService = inject(UserFirebaseService)
  alertController = inject(AlertController)

  // STATE

  // SELECTORS
  isLoading = computed(() => this.userService.isLoading())

  // ACTIONS
  onLogin = async({email, password}: {email: string, password: string}) => {
    const { error } = await this.userService.login(email, password)
    if(error !== null) {
  
      const errorMessage: any = {
        'auth/user-not-found': `User '${email}' not found`,
        'auth/wrong-password': `Wrong password`
      }

      const alert = await this.alertController.create({
        header: 'Login failed',
        message: errorMessage[error],
        buttons: [
          { text: 'Ok', role: 'cancel' },
        ],
      })
      alert.present()
    }
  }

  // PRIVATE
  

}