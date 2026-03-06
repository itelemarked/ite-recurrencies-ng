import { Component, computed, inject, input, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { form, FormField, pattern, required, validate } from "@angular/forms/signals";

import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonList, IonRadio, IonRadioGroup, IonTitle, IonToolbar, ModalController } from "@ionic/angular/standalone";

import { PositiveInteger } from "../types/PositiveInteger.type";
import { PeriodUnit } from "../../../js/timezone-date/types/PeriodUnit";

@Component({
  selector: 'app-recurrency-list-item-details-period',
  standalone: true,
  imports: [
      FormsModule,
      IonHeader,
      IonToolbar,
      IonButtons,
      IonButton,
      IonIcon,
      IonTitle,
      IonContent,
      IonList,
      IonItem,
      IonInput,
      IonRadioGroup,
      IonRadio,
      FormField
  ],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="onBackButtonClick()">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Edit Period</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="onCancelClick()">Cancel</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">


      <label class="list-header">Period Number</label>
      <ion-list class="with-list-header" [inset]="true">
        <ion-item>
          <ion-input
            class="period-number-ctl"
            type="text"
            inputMode="numeric"
            placeholder="Enter a number"
            [clearInput]="true"
            [formField]="form.periodNbCtl"
          />
        </ion-item>
      </ion-list>

      <!-- @if (form.periodNbCtl().touched() && form.periodNbCtl().invalid()) {
        <ul>
          @for (error of form.periodNbCtl().errors(); track error.message) {
            <li>{{ error.message }}</li>
          }
        </ul>
      } -->

      <label class="list-header">Period Unit</label>
      <ion-list class="with-list-header" [inset]="true">
        <ion-radio-group 
          class="period-unit-ctl"
          [formField]="form.periodUnitCtl"
        >
          <ion-item>
            <ion-radio value="days">Days</ion-radio>
          </ion-item>

          <ion-item>
            <ion-radio value="weeks">Weeks</ion-radio>
          </ion-item>

          <ion-item>
            <ion-radio value="months">Months</ion-radio>
          </ion-item>
            
          <ion-item>
            <ion-radio value="years">Years</ion-radio>
          </ion-item>
            
        </ion-radio-group>
      </ion-list>


    </ion-content>
  `,
  styles: [`
    .period-number-ctl.ng-touched.ng-invalid {
      --color: var(--ion-color-danger-tint);
    }

    .period-unit-ctl.ng-touched.ng-invalid ion-item {
      --color: var(--ion-color-danger-tint);
    }
  `]
})
export class RecurrencyListItemDetailsPeriodComponent {
  // DEPENDENCIES
  modalCtrl = inject(ModalController)

  // STATE
  periodNb = input.required<PositiveInteger | null>()
  periodUnit = input.required<PeriodUnit | null>()

  formModel = signal<{
    periodNbCtl: string,
    periodUnitCtl: PeriodUnit | null
  }>({
    periodNbCtl: '',
    periodUnitCtl: null
  })

  form = form(this.formModel, (schema) => {
    required(schema.periodNbCtl, {message: 'A period number must be set...'}),
    pattern(schema.periodNbCtl, /^\d*$/, {message: 'It must be numeric!'}),
    
    validate(schema.periodUnitCtl, ({value}) => {
      if (value() === null) {
        return {
          kind: 'null-value',
          message: 'A value must be chosen...',
        };
      }
      return null;
    });
  })
  
  // SELECTORS
  currentPeriodNumber = computed(() => {
    const val = this.form.periodNbCtl().value()
    return val.trim() === '' ? null : +val as PositiveInteger
  })

  currentPeriodUnit = computed(() => this.form.periodUnitCtl().value())

  // ACTIONS
  ngOnInit() {
    this.form.periodNbCtl().value.set(this.periodNb() === null ? '' : this.periodNb()!.toString())
    this.form.periodUnitCtl().value.set(this.periodUnit())
  }

  onBackButtonClick = () => {
    const periodNb = this.currentPeriodNumber()
    const periodUnit = this.currentPeriodUnit()
    if(periodNb === null || periodUnit === null) {
      this.form.periodNbCtl().markAsTouched()
      this.form.periodUnitCtl().markAsTouched()
    } else {
      this.modalCtrl.dismiss({
        periodNb,
        periodUnit
      })
    }
  }

  onCancelClick = () => {
    this.modalCtrl.dismiss({
      periodNb: this.periodNb(),
      periodUnit: this.periodUnit()
    })
  }

  // PRIVATE

}