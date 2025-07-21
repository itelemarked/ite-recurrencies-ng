import { Component, input } from '@angular/core';
import { AppListComponent } from '../../../../../components/app-list.component';
import { IonItem, IonLabel, IonList, IonNote } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { DateFormat } from '../../../../../types/DateFormatOptions';
import { Timezone } from '../../../../../types/TimezoneString';

@Component({
  selector: 'app-date-settings-list',
  standalone: true,
  imports: [
    CommonModule,
    AppListComponent,
    IonList,
    IonItem,
    IonLabel,
    IonNote
  ],
  template: `
    <app-list>
      <header>DATE SETTINGS</header>
      <ion-list [inset]="true">
        <ion-item
          [button]="true"
          appBlurOnClick
          routerLink="./dateformat-options"
        >
          <ion-label>Date format</ion-label>
          <ion-note>**{{dateFormatInput()}}**</ion-note>
        </ion-item>
        <ion-item
          [button]="true"
          appBlurOnClick
          routerLink="./timezone-options"
        >
          <ion-label>Timezone</ion-label>
          <ion-note>**Europe/Zurich**</ion-note>
        </ion-item>
      </ion-list>
    </app-list>
  `,
  styles: ``,
})
export class DateSettingsListComponent {

  dateFormatInput = input.required<string>({alias: 'dateFormat'})
  // timezoneInput = input.required<Timezone | 'PLATFORM_DEFINED'>({alias: 'timezone'})

  constructor() {}
}
