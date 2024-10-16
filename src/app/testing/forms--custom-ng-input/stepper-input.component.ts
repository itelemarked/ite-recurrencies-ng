
import { Component, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-stepper-input',
  standalone: true,
  imports: [
    IonButton,
    IonIcon
  ],
  providers: [
    // REQUIRED - FOR CONTROL VALUE ACCESSOR
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: StepperInput
    },
  ],
  template: `

    <div class="choose-quantity">
      <ion-button (click)="onRemove()" color="primary" size="small">-</ion-button>
      <div class="quantity">{{quantity}}</div>
      <ion-button (click)="onAdd()" color="primary" size="small">+</ion-button>
    </div>

  `,
  styles: `
    :host {
      /*Component CSS variables (maybe overwritten)*/
      --color-valid: var(--ion-color-primary);
      --color-invalid: var(--ion-color-danger);
    }
    
    :host {
      display: inline-block;
      border: 1px solid var(--color-valid);
    }

    :host.ng-invalid {
      border: 1px solid var(--color-invalid);

      .quantity {
        color: var(--color-invalid)
      }
    }

    .choose-quantity {
      display: flex;
      align-items: center;
    }

    .quantity {
      width: 50px;
      text-align: center;
      color: var(--color-valid);
    }
  `
})
export class StepperInput implements ControlValueAccessor {

  quantity = 0
  increment = input(1)

  constructor() {}


  // ACTIONS

  onAdd() {
    this.markAsTouched()
    if (!this.disabled) {
      this.quantity = this.quantity + this.increment()
      this.onChange(this.quantity)
    }
  }
  
  onRemove() {
    this.markAsTouched()
    if (!this.disabled) {
      const newValue = this.quantity - this.increment()
      this.quantity = newValue >= 0 ? newValue : 0
      this.onChange(this.quantity)
    }
  }


  // UTILS

  markAsTouched() {
    // console.log('markAsTouched')
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }


  // CONTROL VALUE ACCESSOR INTERFACE

  touched = false
  disabled = false
  onChange = (quantity: number) => {};
  onTouched = () => {};

  writeValue(quantity: number) {
    // console.log('writeValue')
    this.quantity = quantity;
  }

  registerOnChange(onChange: (qty: number) => void) {
    // console.log('registerOnChange')
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => {}) {
    // console.log('registerOnTouched')
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

}





