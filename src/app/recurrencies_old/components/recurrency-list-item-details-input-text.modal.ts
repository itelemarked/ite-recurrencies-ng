import { NgClass } from '@angular/common';
import { Component, computed, inject, input, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
    IonIcon,
    NgClass,
  ],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="onBackButtonClick()">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ modalTitle() }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="onCancelClick()">
            Cancel
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content [forceOverscroll]="false">
      <ion-list [inset]="true">
        <ion-item>
          <ion-input 
            [ngClass]="{'app-invalid': hasErrors() && showErrors()}"
            type="text" 
            placeholder="Enter a title" 
            [clearInput]="true"
            [(ngModel)]="currentValue"
          />
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styles: [`
    .app-invalid {
      --color: var(--ion-color-danger-tint);
    }
  `],
})
export class RecurrencyListItemDetailsInputTextModal {

  // DEPENDENCIES
  modalCtrl = inject(ModalController)

  // STATE
  modalTitle = input.required<string>()
  inputValue = input.required<string | null>()
  currentValue!: WritableSignal<string>
  showErrors = signal(false)

  // SELECTORS
  hasErrors = computed(() => this.currentValue().trim() === '')

  constructor() {
    addIcons({
      chevronBackOutline,
      closeCircleOutline
    })
  }

  ngOnInit() {
    const inputValue = this.inputValue()
    this.currentValue = signal(inputValue === null ? '' : inputValue)
  }

  onBackButtonClick() {
    if(this.hasErrors()) {
      this.showErrors.set(true)
    } else {
      this.modalCtrl.dismiss(this.currentValue())
    }
  }

  onCancelClick() {
    this.modalCtrl.dismiss(this.inputValue())
  }

}
