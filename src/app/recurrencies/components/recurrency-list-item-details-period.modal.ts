import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonList, IonRadio, IonRadioGroup, IonTitle, IonToolbar } from "@ionic/angular/standalone";

@Component({
  selector: 'app-recurrency-list-item-details-period',
  standalone: true,
  imports: [
      FormsModule,
      IonHeader,
      IonToolbar,
      IonButtons,
      IonButton,
      IonIcon,
      IonTitle,
      IonContent,
      IonList,
      IonItem,
      IonInput,
      IonRadioGroup,
      IonRadio
  ],
  template: `
    <<ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="onBackButtonClick()">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Edit Period</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="onCancelClick()">Cancel</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">

      <label class="list-header">Period Number</label>
      <ion-list class="with-list-header" [inset]="true">
        <ion-item>
          <ion-input
            type="text"
            inputMode="numeric"
            [clearInput]="true"
          />
        </ion-item>
      </ion-list>

      <label class="list-header">Period Unit</label>
      <ion-list class="with-list-header" [inset]="true">
        <ion-radio-group>
          <ion-item>
            <ion-radio value="days">Days</ion-radio>
          </ion-item>

          <ion-item>
            <ion-radio value="weeks">Weeks</ion-radio>
          </ion-item>

          <ion-item>
            <ion-radio value="months">Months</ion-radio>
          </ion-item>
            
          <ion-item>
            <ion-radio value="years">Years</ion-radio>
          </ion-item>
            
        </ion-radio-group>
      </ion-list>

    </ion-content>
  `,
  styles: [``]
})
export class RecurrencyListItemDetailPeriodComponent {
  // DEPENDENCIES

  // STATE

  // SELECTORS

  // ACTIONS
  onBackButtonClick = () => {}

  onCancelClick = () => {}

  // PRIVATE

}