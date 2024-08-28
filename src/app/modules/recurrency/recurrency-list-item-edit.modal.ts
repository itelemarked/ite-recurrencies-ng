import { Component, computed, Input, input, InputSignal, model, OnInit } from '@angular/core';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonList, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { RecurrenciesService } from './recurrency.service';
import { Recurrency, SETUP } from './Recurrency';

@Component({
  selector: 'app-recurrencies-edit',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonBackButton, IonList, IonItem, IonInput],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" (click)="onCancel()">Cancel</ion-button>
        </ion-buttons>
        <ion-title>RecurrenciesEditModal</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="onConfirm()" [strong]="true">Confirm</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">
      <ion-list>
        <ion-item>
          <ion-input
            label="Title"
            labelPlacement="stacked"
            placeholder="Enter title"
            [value]="title()"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-input
            label="Last event date"
            labelPlacement="stacked"
            placeholder="Enter lastEvent"
            [value]="lastEventString()"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-input
            label="Period number"
            labelPlacement="stacked"
            placeholder="Enter period number"
            [value]="periodNbString()"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-input
            label="Period unit"
            labelPlacement="stacked"
            placeholder="Enter period unit"
            [value]="periodUnitString()"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-input
            label="Expiry date"
            labelPlacement="stacked"
            placeholder="Enter expiry date"
            [value]="expiryString()"
          ></ion-input>
        </ion-item>
        <ion-button
          class="ion-padding-top"
          expand="full"
          (click)="onConfirm()"
        >OK</ion-button>
      </ion-list>
    </ion-content>
  `,
  styles: ``,
})
export class RecurrencyListItemEditModal implements OnInit {

  // INPUTS
  // recurrency: InputSignal<Recurrency | undefined> = input()
  @Input() recurrency: Recurrency | undefined

  // TEMPLATE VARS
  title = model<string>()
  lastEventString = model<string>()
  periodNbString = model<string>()
  periodUnitString = model<string>()
  expiryString = model<string>()
  // lastEventString = model(() => this.recurrency?.lastEvent().toString({format: 'DD.MM.YYYY', offset: SETUP.offset}))
  // periodNbString = model(() => this.recurrency?.periodNb().toString())
  // periodUnitString = model(() => this.recurrency?.periodUnit())
  // expiryString = model(() => this.recurrency?.expiry().toString({format: 'DD.MM.YYYY', offset: SETUP.offset}))
  
  isCreateMode = computed(() => this.recurrency === undefined)

  constructor(private modalCtrl: ModalController, private recurrenciesService: RecurrenciesService) {}

  ngOnInit(): void {
    this.title.set(this.recurrency?.title() || 'default title')
    this.lastEventString.set(this.recurrency?.lastEvent().toString({format: 'DD.MM.YYYY', offset: SETUP.offset}))
  }

  onCancel() {
    this.modalCtrl.dismiss()
  }

  onConfirm() {
    // if(this.isCreateMode()) {
    //   const title = this.title()!
    //   const lastEvent = '2022-01-01'
    //   const periodNb = 99
    //   const periodUnit = 'days'
    //   this.recurrenciesService.add(new Recurrency(title, lastEvent, periodNb, periodUnit))
    // } else {

    // }
    console.log(this.title())
    this.modalCtrl.dismiss()
  }

}