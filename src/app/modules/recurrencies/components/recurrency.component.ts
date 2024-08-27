
import { Component, Input, InputSignal, OnChanges, OnInit, SimpleChanges, computed, input } from '@angular/core';
import { IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonProgressBar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';
import { PeriodUnit } from '../types/PeriodUnit';
import { Recurrency } from '../models/Recurrency';

@Component({
  selector: 'app-recurrencies-list-item',
  standalone: true,
  imports: [IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption, IonIcon, IonProgressBar],
  template: `
    <ion-item-sliding>
      <ion-item lines="none">
        <ion-label>
          <h2>{{ title }}</h2>
          <p>Last event: {{ lastEventString }}</p>
          <p>Period: {{ periodString }}</p>
          <p>Expires: {{ expiryString }} ({{ remainingDaysString }})</p>
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

    <ion-progress-bar [value]="progress" [color]="progressColor"></ion-progress-bar>
  `,
  styles: ``,
})
export class RecurrenciesListItemComponent implements OnChanges {
  // INPUTS
  @Input({required: true}) title!: string;
  @Input({required: true}) lastEvent!: string;
  @Input({required: true}) periodNb!: number;
  @Input({required: true}) periodUnit!: PeriodUnit;

  // SETUPS
  private breakpointWarning = 0.6    // Warning if 0.6 or above
  private breakpointCritical = 0.8   // Critical if 0.8 or above

  // TEMPLATE VARS
  periodString!: string
  expiryString = '25.11.2024'
  remainingDaysString = '32 days left'
  progress = 0.8
  progressColor = 'danger'


  constructor() {
    addIcons({createOutline, trashOutline})
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('onChanges')
    this.periodString = this.getPeriodString(this.periodNb, this.periodUnit)
  }

  getPeriodString(periodNb: number, periodUnit: PeriodUnit): string {
    return `${periodNb.toString()} ${periodUnit}`
  }

}

// export class RecurrencyComponent {
//   // INPUTS
//   recurrency: InputSignal<Recurrency> = input.required()

//   // SETUPS
//   private breakpointWarning = 0.6    // Warning if 0.6 or above
//   private breakpointCritical = 0.8   // Critical if 0.8 or above

//   // TEMPLATE VARS
//   periodString = computed(() => `${this.recurrency().periodNb} ${this.recurrency().periodUnit}` )
//   expiryString = '25.11.2024'
//   remainingDaysString = '32 days left'
//   progress = 0.8
//   progressColor = 'danger'


//   constructor() {
//     addIcons({createOutline, trashOutline})
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     console.log('onChanges')
//     this.periodString = this.getPeriodString(this.periodNb, this.periodUnit)
//   }

//   getPeriodString(periodNb: number, periodUnit: PeriodUnit): string {
//     return `${periodNb.toString()} ${periodUnit}`
//   }

// }
