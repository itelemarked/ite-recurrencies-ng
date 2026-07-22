
import { Component, inject } from "@angular/core";
import { IonicModule } from '@ionic/angular';
import { AuthService } from "../../auth/services/auth-service";
import { SettingsService } from "../../settings/services/settings-service3";
import { Settings } from "../../_types/Settings";

@Component({
  selector: 'app-testing-settings-service2',
  imports: [
    IonicModule
  ],
  template: `
    <div class="p-1">
      <ion-button
        size="small"
        (click)="authService.login('aaa@aaa.com', '111111')"
      >login aaa</ion-button>
    </div>
    <div class="p-1">
      <ion-button
        size="small"
        (click)="authService.login('aaa@aa.com', '111111')"
      >wrong email</ion-button>
    </div>
    <div class="p-1">
      <ion-button
        size="small"
        (click)="authService.login('aaa@aaa.com', '1')"
      >wrong password (for aaa@aaa.com)</ion-button>
    </div>
    <div class="p-1">
      <ion-button
        size="small"
        (click)="authService.signup('aaa@aaa.com', '123456')"
      >wrong signup (already existing aaa@aaa.com)</ion-button>
    </div>
    <div class="p-1">
      <ion-button
        size="small"
        (click)="authService.login('bbb@bbb.com', '222222')"
      >login bbb</ion-button>
    </div>
    <div class="p-1">
      <ion-button
        size="small"
        (click)="authService.signup('ccc@ccc.com', '333333')"
      >signup ccc</ion-button>
    </div>
    <div class="p-1">
      <ion-button
        size="small"
        (click)="authService.logout()"
      >logout</ion-button>
    </div>
    <div class="p-1">
      user: {{ !!user()? user()!.email : 'no user logged-in' }} <br>
      isLoading: {{ userIsLoading() }} <br>
      error: {{ !!userError() ? userError()!.message : 'no errors' }}
    </div>

    <div>---------------------------------------------</div>

    <div>
      <span class="p-1">
        <ion-button
          size="small"
          (click)="settingsService.update({dateFormat: 'CH_DATE_TIME'})"
        >upate DateFormat CH_DATE_TIME</ion-button>
      </span>
      <span class="p-1">
        <ion-button
          size="small"
          (click)="settingsService.update({dateFormat: 'CH_DATE'})"
        >upate DateFormat CH_DATE</ion-button>
      </span>
      <span class="p-1">
        <ion-button
          size="small"
          (click)="settingsService.update(wrongDateFormat)"
        >upate DateFormat Wrong</ion-button>
      </span>
    </div>

    <div>
      <span class="p-1">
        <ion-button
          size="small"
          (click)="settingsService.set({
            timezone: 'Indian/Mauritius',
            dateFormat: 'CH_DATE_TIME'
          })"
        >set CH_DATE_TIME / Mauritius</ion-button>
      </span>
      <span class="p-1">
        <ion-button
          size="small"
          (click)="settingsService.set({
            timezone: 'Europe/Zurich',
            dateFormat: 'CH_DATE'
          })"
        >set CH_DATE / Zurich</ion-button>
      </span>
      <span class="p-1">
        <ion-button
          size="small"
          (click)="settingsService.set(wrongSettings1)"
        >set Wrong 1</ion-button>
      </span>
      <span class="p-1">
        <ion-button
          size="small"
          (click)="settingsService.set(wrongSettings2)"
        >set Wrong 2</ion-button>
      </span>
    </div>

    <div>
      <span class="p-1">
        <ion-button
          size="small"
          (click)="settingsService.clear()"
        >clear</ion-button>
      </span>
    </div>

    <div class="p-1">
      timezone: {{ !!doc()? doc()!.timezone : 'no data found' }} <br>
      dateFormat: {{ !!doc()? doc()!.dateFormat : 'no data found' }} <br>
      isLoading: {{ docIsLoading() }} <br>
      error: {{ !!docError() ? docError()!.message : 'no errors' }}
    </div>
  `,
  styles: [``]
})
export class TestingSettingsService2 {
  authService = inject(AuthService)
  
  user$ = this.authService.user$
  userIsLoading$ = this.authService.isLoading$
  userError$ = this.authService.error$
  user = this.authService.user
  userIsLoading = this.authService.isLoading
  userError = this.authService.error


  settingsService = inject(SettingsService)

  doc = this.settingsService.doc
  docIsLoading = this.settingsService.isLoading
  docError = this.settingsService.error

  wrongDateFormat = {dateFormat: 'CH_DATE_TIM'} as unknown as Partial<Settings>
  wrongSettings1 = {
    timezone: 'Europe/Zuric',
    dateFormat: 'CH_DATE_TIM'
  } as unknown as Settings
  wrongSettings2 = {
    dateFormat: 'CH_DATE_TIME'
  } as unknown as Settings


}