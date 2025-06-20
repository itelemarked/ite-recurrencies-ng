import { Component, effect, inject } from "@angular/core";
import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { RecStore } from "./storeService";

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

  recService = inject(RecStore)

  constructor() {
    this.test()
  }

  async test() {
    await this.recService.addDoc('1', {title: 'Rec-1'})
    console.log(this.recService.getDocs())
    // await this.recService.addDoc('2', {title: 'Rec-2'})
    await this.recService.removeDoc('0')
    console.log(this.recService.getDocs())
  }

}