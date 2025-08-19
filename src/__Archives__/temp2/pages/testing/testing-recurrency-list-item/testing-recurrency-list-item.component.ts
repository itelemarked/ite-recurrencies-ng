import { Component } from '@angular/core';
import {
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonText,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-testing-recurrency-list-item',
  standalone: true,
  imports: [IonList, IonItem, IonLabel, IonText, IonNote],
  template: `
    <ion-list>
      <ion-item button>
        <ion-label>
          <strong>SERE SEA</strong><br />
          <!-- <ion-text>Never Gonna Give You Up</ion-text><br /> -->
          <ion-note  style="font-size: 0.8em;" color="medium">
            Expires: 31.06.25
          </ion-note>
        </ion-label>
        <div slot="end">
          <ion-note style="font-size: 0.8em;" color="medium">32 days left</ion-note>
        </div>
      </ion-item>
    </ion-list>
  `,
  styles: [``],
})
export class TestingRecurrencyListItemComponent {}
