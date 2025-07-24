import { Component, computed, inject, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';


import { UserSettingsListComponent } from './components/user-settings-list.component';
import { DateSettingsListComponent } from './components/date-settings-list.component';
import { SettingsService } from '../../../../services/settings.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    UserSettingsListComponent,
    DateSettingsListComponent
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="ion-padding">

      <app-user-settings-list
        [loading]="showLoading()"
        [user]="authService.user()"
      />

      <app-date-settings-list
        [forceLoading]="showLoading()"
        [dateFormat]="settingsService.dateFormat()"
        [timezone]="settingsService.timezone()"
      />
      <!-- <app-date-settings-list
        [loading]="user() === undefined || dateFormatString() === undefined || timezoneString() === undefined"
        [dateFormat]="dateFormatString()"
        [timezone]="timezoneString()"
      /> -->
      
    </ion-content>
  `,
  styles: `

    .user-icon-skeleton {
      display: inline-block;
      border-radius: 50px;
      padding: 5px;
      height: 3em;
      width: 3em;
      margin-left: 4px;
    }

    .user-label-skeleton {
      display: inline-block;
      height: 0.8em;
      width: 200px;
    }
  `,
})
export class SettingsPage {

  settingsService = inject(SettingsService)
  authService = inject(AuthService)

  showLoading = computed(() => {
    return this.authService.user() === undefined || 
    this.settingsService.settings() === undefined
  })

  constructor() {}

  // private getDateFormatString(settingsService: SettingsService, injector: Injector) {
  //   const initialValue = new Date('2025-12-31').toLocaleDateString()
  //   const mapData = (data: DateFormat | null | undefined): string | undefined => {
  //     switch(data) {
  //       case undefined: return undefined
  //       case null: return initialValue
  //       case DateFormat.CH: return '31.12.25'
  //       case DateFormat.US: return '12/31/25'
  //       case DateFormat.ISO: return '2025-12-31'
  //     }
  //   }
  //   const dateFormatString$ = settingsService.dateFormat$.pipe(map(mapData))
  //   return toSignal(dateFormatString$, {injector})
  // }
  
  // private getTimezoneString(settingsService: SettingsService, injector: Injector) {
  //   const initialValue = Intl.DateTimeFormat().resolvedOptions().timeZone
  //   const mapData = (data: Timezone | null | undefined): string | undefined => {
  //     switch(data) {
  //       case undefined: return undefined
  //       case null: return initialValue
  //       default: return data
  //     }
  //   }
  //   const timezoneString$ = settingsService.timezone$.pipe(map(mapData))
  //   return toSignal(timezoneString$, {injector, initialValue})
  // }

  // private getUser(authService: AuthService, injector: Injector) {
  //   return toSignal(authService.user$, {injector})
  // }
  
}
