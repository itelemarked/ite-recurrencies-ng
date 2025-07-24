import { Component, computed, input } from '@angular/core';
import { AppListComponent } from '../../../../../components/app-list.component';
import { IonItem, IonLabel, IonList, IonNote, IonSkeletonText } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { DateFormat } from '@app/types/DateFormat.enum';
import { Timezone } from '@app/types/Timezone.enum';

@Component({
  selector: 'app-date-settings-list',
  standalone: true,
  imports: [
    CommonModule,
    AppListComponent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonSkeletonText
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
          <ng-container *ngIf="!forceLoading()">
            <ion-note>**{{ dateFormatString() }}**</ion-note>
          </ng-container>
          <ng-container *ngIf="forceLoading()">
            <ion-note style="width: 50%;">
              <ion-skeleton-text [animated]="true"/>
            </ion-note>
          </ng-container>
        </ion-item>
        <ion-item
          [button]="true"
          appBlurOnClick
          routerLink="./timezone-options"
        >
          <ion-label>Timezone</ion-label>
          <ng-container *ngIf="!forceLoading()">
            <ion-note>**{{ timezoneString() }}**</ion-note>
          </ng-container>
          <ng-container *ngIf="forceLoading()">
            <ion-note style="width: 50%;">
              <ion-skeleton-text [animated]="true"/>
            </ion-note>
          </ng-container>
        </ion-item>
      </ion-list>
    </app-list>
  `,
  styles: ``,
})
export class DateSettingsListComponent {

  forceLoading = input<boolean>(false)
  dateFormat = input<DateFormat | undefined>()
  timezone = input<Timezone | undefined>()

  dateFormatString = computed(() => {
    switch(this.dateFormat()) {
      case undefined: 
      case DateFormat.PLATFORM_DEFINED: return new Date('2025-12-31').toLocaleDateString()
      case DateFormat.CH: return '31.12.25'
      case DateFormat.US: return '12/31/25'
      case DateFormat.ISO: return '2025-12-31'
    }
  })

  timezoneString = computed(() => this.timezone())
}
