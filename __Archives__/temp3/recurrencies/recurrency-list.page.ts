import { Component, computed, inject } from "@angular/core";
import { IonContent, IonHeader, IonItem, IonList, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { CommonModule } from "@angular/common";

import { RecurrencyFirebaseService } from "./services/recurrency-firebase.service";
import { RecurrencyListItemComponent } from "./components/recurrency-list-item.component";
import { add, diff, endOf, format } from "src/__Archives__/temp3/_utils/date";
import { DATE_FORMAT, DateFormat } from "src/__Archives__/temp3/_types/DateFormat";
import { Timezone, TIMEZONE } from "src/__Archives__/temp3/_types/Timezone";
import { Identifiable } from "src/__Archives__/temp3/_types/Identifiable";
import { TimezoneDate } from "./models/TimezoneDate.model";
import { RecurrencyMockService, TempoSettingsService, TempoUserService } from "./services/recurrency-mock.service";
import { MOCK_DATAS } from "./services/mock-datas";
import { Recurrency } from "./models/Recurrency.model";

@Component({
  selector: 'app-recurrency-list',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    RecurrencyListItemComponent
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          RecurrencyList
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content [forceOverscroll]="false">

      <!-- TODO: With inset set: the lines disappeared if a container wraps the ion-item tags... -->
      <ion-list [inset]="true">
        <ng-container *ngFor="let recurrency of recurrencyService.recurrencies()">
          <recurrency-list-item
            [recurrency]="recurrency"
          />
        </ng-container>
      </ion-list>

    </ion-content>
  `,
  styles: [``]
})
export class RecurrencyListPage {

  userService = inject(TempoUserService)
  settingsService = inject(TempoSettingsService)
  recurrencyService = inject(RecurrencyMockService)

  // recurrencies!: Recurrency[]

  constructor() {
    this.userService.user$.subscribe(console.log)
    this.settingsService.settings$.subscribe(console.log)
    // this.recurrencyService.getAll$().subscribe(res => {
    //   // console.log(res.map(r => r.getExpiryDate().toString('ISO')))
    //   this.recurrencies = res
    // })
  }

}
