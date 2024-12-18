
import { Component, computed, input } from '@angular/core';
import { IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonProgressBar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';
import { Recurrency } from './interfaces/Recurrency';
import { add, diff, format } from './utils/utils-date';


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
        <ion-item-option color="light">
          <ion-icon slot="icon-only" icon="create-outline"></ion-icon>
        </ion-item-option>
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
  recurrency = input.required<Recurrency>()

  title = computed(() => this.recurrency().title)
  lastEventString = computed(() => format(this.recurrency().lastEvent, 'short', 'fr-CH'))
  periodString = computed(() => this.recurrency().periodNb + ' ' + this.recurrency().periodUnit)
  expiryString = computed(() => {
    return format(this.expiryDate(), 'short', 'fr-CH')
  })
  daysLeftString = computed(() => {
    return diff(this.expiryDate(), this.nowDate(), 'days')
  })
  progress = computed(() => {
    return (this.nowDate().valueOf() - this.lastEventDate().valueOf()) / (this.expiryDate().valueOf() - this.lastEventDate().valueOf())
  })
  progressColor = computed(() => {
    if(this.progress() < 0.7) return 'success'
    if(this.progress() < 0.85) return 'warning'
    return 'danger'
  })

  constructor() {
    addIcons({createOutline, trashOutline})
  }

  private lastEventDate(): Date {
    return this.recurrency().lastEvent
  }

  private expiryDate(): Date {
    const { lastEvent, periodNb, periodUnit } = this.recurrency()
    return add(lastEvent, periodNb + 1, periodUnit)
  }

  private nowDate(): Date {
    return new Date()
  }
}
