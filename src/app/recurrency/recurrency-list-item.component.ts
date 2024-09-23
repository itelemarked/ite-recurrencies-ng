
import { Component, computed, input, Input, InputSignal, OnChanges, OnInit, output, Signal, SimpleChanges, ViewChild, viewChild } from '@angular/core';
import { IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonProgressBar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';
import { DatumDayjs } from '../_models/DatumDayjs';
import { use } from '../_utils/global';
import { IDatum } from '../_interfaces/IDatum';
import { IRecurrency } from '../_interfaces/IRecurrency';

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

  private _datum = use<typeof DatumDayjs>(DatumDayjs)
  
  // INPUTS
  recurrency: InputSignal<IRecurrency> = input.required()

  // OUTPUTS
  delete = output<void>()
  edit = output<void>()

  // VIEW CHILD
  ionItemSlidingRef = viewChild.required(IonItemSliding)

  // TEMPLATE VARS
  title = computed(() => this.recurrency().title)
  // lastEventString = computed(() => this.recurrency().lastEvent.toString({format: 'DD.MM.YYYY', offset: SETUP.offset}))
  lastEventString = computed(() => 'xxxx')
  periodString = computed(() => `${this.recurrency().periodNb} ${this.recurrency().periodUnit}`)
  expiryString = computed(() => 'xxxx')
  progress = computed(() => 0.5)
  // remainingDaysString = computed(() => {
  //   const diffDays = this._datum.diff(this.recurrency().expiry(), this._datum.now(), 'days')
  //   return diffDays.toString() + ' days left'
  // })
  remainingDaysString = computed(() => 'remaining: xxxx days/weeks/...')
  progressColor = computed(() => {
    // if(this.recurrency().progress() < 0.6) return 'success'
    // if(this.recurrency().progress() < 0.8) return 'warning'
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
