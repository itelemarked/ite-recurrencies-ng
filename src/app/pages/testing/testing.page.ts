
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { SettingsService } from '../../services/settings.service';




@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="p-xl">

      <div>Datas:</div>
      <div *ngFor="let data of datas()">
        uid: {{data.uid}}, title: {{data.title}}
      </div>

    </ion-content>
  `,
  styles: ``,
})
export class TestingPage {

  private settingsService = inject(SettingsService)

  datas = this.settingsService.getAll

  constructor() {
    this.TEST()
  }

  private TEST() {
    setTimeout(() => {
      // this.settingsService.updateDoc({uid: 'uid-3', title: 'a new one changed!'})
      // .then(_ => console.log('update success'))
      // .catch(err => console.log('nothing to update... uid has not been found'))

      this.settingsService.removeDoc('uid-3')
      .then(_ => console.log('remove success'))
      .catch(err => console.log('nothing to remove... uid has not been found'))
    }, 2000);
  }

}