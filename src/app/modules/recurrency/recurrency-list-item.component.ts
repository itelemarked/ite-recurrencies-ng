
import { Component, computed, input, Input, InputSignal, OnChanges, OnInit, output, Signal, SimpleChanges, ViewChild, viewChild } from '@angular/core';
import { IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonProgressBar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';
import { PeriodUnit } from './types/PeriodUnit.type';
import { Recurrency, SETUP } from './Recurrency.model';
import { Datum } from './Datum.model';

@Component({
  selector: 'app-recurrencies-list-item',
  standalone: true,
  imports: [IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption, IonIcon, IonProgressBar],
  template: `
    <ion-item-sliding #ionItemSlidingRef>
      <ion-item lines="none">
        <ion-label>
          <h2>{{ title() }}</h2>
          <p>Last event: {{ lastEventString() }}</p>
          <p>Period: {{ periodString() }}</p>
          <p>Expires: {{ expiryString() }} ({{ remainingDaysString() }})</p>
        </ion-label>
      </ion-item>
      
      <ion-item-options>
        <ion-item-option color="light" (click)="onEdit()">
          <ion-icon slot="icon-only" icon="create-outline"></ion-icon>
        </ion-item-option>
        <ion-item-option color="danger" (click)="onDelete()">
          <ion-icon slot="icon-only" icon="trash-outline"></ion-icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>

    <ion-progress-bar [value]="progress()" [color]="progressColor()"></ion-progress-bar>
  `,
  styles: ``,
})
export class RecurrencyListItemComponent {
  // INPUTS
  recurrency: InputSignal<Recurrency> = input.required()

  // OUTPUTS
  delete = output<void>()
  edit = output<void>()

  // VIEW CHILD
  ionItemSlidingRef = viewChild.required(IonItemSliding)

  // TEMPLATE VARS
  title = computed(() => this.recurrency().title())
  lastEventString = computed(() => this.recurrency().lastEvent().toString({format: 'DD.MM.YYYY', offset: SETUP.offset}))
  periodString = computed(() => `${this.recurrency().periodNb()} ${this.recurrency().periodUnit()}`)
  expiryString = computed(() => this.recurrency().expiry().toString({format: 'DD.MM.YYYY', offset: SETUP.offset}))
  progress = computed(() => this.recurrency().progress())
  remainingDaysString = computed(() => {
    const diffDays = Datum.diff(this.recurrency().expiry(), Datum.now(), 'days')
    return diffDays.toString() + ' days left'
  })
  progressColor = computed(() => {
    if(this.recurrency().progress() < 0.6) return 'success'
    if(this.recurrency().progress() < 0.8) return 'warning'
    return 'danger'
  })

  constructor() {
    addIcons({createOutline, trashOutline})
  }

  onEdit() {
    this.edit.emit()
    this.ionItemSlidingRef().close()
  }

  onDelete() {
    this.delete.emit()
  }

}

// @Component({
//   selector: 'app-recurrencies-list-item',
//   standalone: true,
//   imports: [IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption, IonIcon, IonProgressBar],
//   template: `
//     <ion-item-sliding>
//       <ion-item lines="none">
//         <ion-label>
//           <h2>{{ title }}</h2>
//           <p>Last event: {{ lastEvent }}</p>
//           <p>Period: {{ periodString }}</p>
//           <p>Expires: {{ expiryString }} ({{ remainingDaysString }})</p>
//         </ion-label>
//       </ion-item>
      
//       <ion-item-options>
//         <ion-item-option color="light">
//           <ion-icon slot="icon-only" icon="create-outline"></ion-icon>
//         </ion-item-option>
//         <ion-item-option color="danger">
//           <ion-icon slot="icon-only" icon="trash-outline"></ion-icon>
//         </ion-item-option>
//       </ion-item-options>
//     </ion-item-sliding>

//     <ion-progress-bar [value]="progress" [color]="progressColor"></ion-progress-bar>
//   `,
//   styles: ``,
// })
// export class RecurrenciesListItemComponent implements OnChanges {
//   // INPUTS
//   @Input({required: true}) title!: string;
//   @Input({required: true}) lastEvent!: string;
//   @Input({required: true}) periodNb!: number;
//   @Input({required: true}) periodUnit!: PeriodUnit;

//   // SETUPS
//   private breakpointWarning = 0.6    // Warning if 0.6 or above
//   private breakpointCritical = 0.8   // Critical if 0.8 or above

//   // TEMPLATE VARS
//   periodString!: string
//   expiryString = '25.11.2024'
//   remainingDaysString = '32 days left'
//   progress = 0.8
//   progressColor = 'danger'


//   constructor() {
//     addIcons({createOutline, trashOutline})
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     this.periodString = this.getPeriodString(this.periodNb, this.periodUnit)
//   }

//   getPeriodString(periodNb: number, periodUnit: PeriodUnit): string {
//     return `${periodNb.toString()} ${periodUnit}`
//   }

// }
