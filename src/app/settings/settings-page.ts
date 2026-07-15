import { Component, computed, inject } from "@angular/core";
import { Router } from "@angular/router";
import { IonicModule } from "@ionic/angular";

import { DateFormat } from "../../js/timezone-date/types/DateFormat";
import { Timezone } from "../../js/timezone-date/types/Timezone";
import { blurActiveElement } from "../../js/ionic/fixes";

import { SharedModule } from "../_shared/_shared-module";
import { AuthService } from "../auth/services/auth-service";
import { DateSettings } from "./components/date-settings";
import { UserSettings } from "./components/user-settings";

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    IonicModule,
    SharedModule,
    DateSettings,
    UserSettings
],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-title>
          Settings
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content [forceOverscroll]="false" class="ion-padding">

      <app-user-settings
        [user]="authService.user()"
        (logout)="onLogout()"
        (authenticate)="onAuthenticate()"
      />

      <app-date-settings
        [dateFormat]="dateFormat()"
        [timezone]="timezone()"
      />
      
    </ion-content>
  `,
  styles: [``]
})
export class SettingsPage {
  protected authService = inject(AuthService)
  protected router = inject(Router)

  dateFormat = computed<DateFormat>(() => 'PLATFORM_DEFINED')
  timezone = computed<Timezone>(() => 'Europe/Zurich')

  onLogout() {
    this.authService.logout()
  }

  onAuthenticate() {
    blurActiveElement()
    this.router.navigateByUrl('/authenticate')
  }
}