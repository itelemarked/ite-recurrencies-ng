import { Component, inject } from "@angular/core";
import { TestingUserServiceComponent } from "@app/auth/testing-user-service.component";
import { RecurrencyServiceFirebase } from "@app/recurrencies/_services/recurrency-service-firebase";
import { isRecurrency } from "@app/recurrencies/_types/Recurrency";
import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/angular/standalone";


@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    TestingUserServiceComponent
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
      
      <app-testing-user-service/>

    </ion-content>
  `,
  styles: [``]
})
export class TestingPage {

  constructor() {}

}