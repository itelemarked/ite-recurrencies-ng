import { Component, inject, Input } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, closeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-input-text-modal',
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonIcon
  ],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="modalCtrl.dismiss(value)">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ modalTitle }}</ion-title>
        <ion-buttons slot="end">
          @if(valueHasChanged) {
            <ion-button (click)="modalCtrl.dismiss()">
              <ion-icon name="close-circle-outline" color="danger"></ion-icon>
            </ion-button>
          }
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content [forceOverscroll]="false">
      <ion-list [inset]="true">
        <ion-item>
          <ion-input type="text" [(ngModel)]="value" (ionInput)="onValueChange($event)"/>
        </ion-item>
      </ion-list>
      <p>value: {{ value }}</p>
      <p>valueHasChanged: {{valueHasChanged}}</p>
    </ion-content>
  `,
  styles: [``],
})
export class InputTextModal {

  modalCtrl = inject(ModalController)

  @Input({required: true}) modalTitle!: string
  @Input() data?: string

  value!: string
  valueHasChanged: boolean = false

  constructor() {
    addIcons({
      chevronBackOutline,
      closeCircleOutline
    })
  }

  ngOnInit() {
    this.value = this.data === undefined ? '' : this.data
  }

  onBackButtonClick() {
    this.modalCtrl.dismiss()
  }

  onValueChange(e: any) {
    this.valueHasChanged = this.value.trim() !== this.data
  }

}
