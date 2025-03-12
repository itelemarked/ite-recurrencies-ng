
import { Component, computed, inject, input } from '@angular/core';

import { IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonProgressBar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';
import { Recurrency } from '../types/Recurrency';
import { add, format } from '../utils/date/date.utils';
import { toInteger } from '../types/Integer';
import { SettingsService } from '../services/settings.service';




@Component({
  selector: 'app-recurrency-list-item',
  standalone: true,
  imports: [IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption, IonIcon, IonProgressBar],
  template: `
    <ion-item-sliding #ionItemSlidingRef>
      <ion-item lines="none">
        <ion-label>
          <h2>{{ title() }}</h2>
          <p>Last event: {{ lastEventString() }}</p>
          <p>Period: {{ periodString() }}</p>
          <p>Expires: {{ expiryString() }} ({{ daysLeftString() }} days left...)</p>
          <p>Progress: {{ progress() }}</p>
        </ion-label>
      </ion-item>
      
      <ion-item-options>
        <ion-item-option color="danger">
          <ion-icon slot="icon-only" icon="trash-outline"></ion-icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>

    <ion-progress-bar [value]="progress()" [color]="progressColor()"></ion-progress-bar>
  `,
  styles: ``,
})
export class RecurrencyListItemComponent {
  // DEPENDENCIES
  private settingsService = inject(SettingsService)

  // INPUT
  recurrencyInp = input.required<Recurrency>({alias: 'recurrency'})

  // VARS
  timezone = this.settingsService.currentSettings().timezone

  // TEMPLATE VARIABLES
  title = computed(() => this.recurrencyInp().title)
  lastEventString = computed(() => format(this.recurrencyInp().lastEvent, 'DD.MM.YY HH:mm:ss.SSS TIMEZONE', this.timezone))
  periodString = computed(() => this.recurrencyInp().periodNb + ' ' + this.recurrencyInp().periodUnit)
  expiryString = computed(() => format(this.expiryDate(), 'DD.MM.YY HH:mm:ss.SSS TIMEZONE', this.timezone))
  daysLeftString = computed(() => {
    // return diff(this.expiryDate(), this.nowDate(), 'days')
  })
  progress = computed(() => {
    return (this.nowDate().valueOf() - this.lastEventDate().valueOf()) / (this.expiryDate().valueOf() - this.lastEventDate().valueOf())
  })
  progressColor = computed(() => {
    if(this.progress() < 0.7) return 'success'
    if(this.progress() < 0.85) return 'warning'
    return 'danger'
  })

  // INIT
  constructor() {
    addIcons({createOutline, trashOutline})
  }

  // HELPERS
  private lastEventDate(): Date {
    return this.recurrencyInp().lastEvent
  }

  private expiryDate(): Date {
    const { lastEvent, periodNb, periodUnit } = this.recurrencyInp()
    return add(lastEvent, toInteger(periodNb + 1), periodUnit)
  }

  private nowDate(): Date {
    return new Date()
  }
}





// export class RecurrencyListItemComponent {
//   // DEPENDENCIES
//   private settingsService = inject(SettingsService)

//   // INPUT
//   recurrencyInp = input.required<Recurrency>({alias: 'recurrency'})

//   // VARS
//   timezone = this.settingsService.currentSettings().timezone

//   // TEMPLATE VARIABLES
//   title = computed(() => this.recurrencyInp().title)
//   lastEventString = computed(() => format(this.recurrencyInp().lastEvent, 'DD.MM.YY HH:mm:ss.SSS TIMEZONE', this.timezone))
//   periodString = computed(() => this.recurrencyInp().periodNb + ' ' + this.recurrencyInp().periodUnit)
//   expiryString = computed(() => format(this.expiryDate(), 'DD.MM.YY HH:mm:ss.SSS TIMEZONE', this.timezone))
//   daysLeftString = computed(() => {
//     // return diff(this.expiryDate(), this.nowDate(), 'days')
//   })
//   progress = computed(() => {
//     return (this.nowDate().valueOf() - this.lastEventDate().valueOf()) / (this.expiryDate().valueOf() - this.lastEventDate().valueOf())
//   })
//   progressColor = computed(() => {
//     if(this.progress() < 0.7) return 'success'
//     if(this.progress() < 0.85) return 'warning'
//     return 'danger'
//   })

//   // INIT
//   constructor() {
//     addIcons({createOutline, trashOutline})
//   }

//   // HELPERS
//   private lastEventDate(): Date {
//     return this.recurrencyInp().lastEvent
//   }

//   private expiryDate(): Date {
//     const { lastEvent, periodNb, periodUnit } = this.recurrencyInp()
//     return add(lastEvent, toInteger(periodNb + 1), periodUnit)
//   }

//   private nowDate(): Date {
//     return new Date()
//   }
// }
