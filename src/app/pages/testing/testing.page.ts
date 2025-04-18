import { Component, effect, inject } from "@angular/core";
import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { AuthService } from "../../services/auth.service";
import { tryCatch } from "../../utils/errors/tryCatch";

@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Testing
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content [forceOverscroll]="false">
      TestingPage works!
    </ion-content>
  `,
  styles: [``]
})
export class TestingPage {

  authService = inject(AuthService)

  constructor() {
    // effect(() => {
    //   const currentUser = this.authService.currentUser()
    //   console.log(currentUser())
    // })
    // this.authService.logout()
    // this.authService.login('aaa@aaa.com', '111111')
    // this.authService.signup('ccc@ccc.com', '333333').then(console.log).catch(console.log)

    const thousendOrError = this.thousendTime()
    thousendOrError.then(console.log).catch(err => console.log(`ERR: ${err.message}`))
  }
  
  async thousendTime() {
    const [err, result] = await tryCatch(mightError())
    if (err) {
      return err
    } else {
      return Math.round(result * 1000)
    }
  }

}


class CustomError extends Error {
  someCustomProp = 'Custom property value'

  constructor(message: string) {
    super(message)
    this.name = 'CustomError'
  }
}

async function mightError() {
  const random = Math.random()

  if(random > 0.5) {
    throw new CustomError(`Value too high`)
  }

  return random
}