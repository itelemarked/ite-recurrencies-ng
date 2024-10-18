import { Component, input, output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonButton, IonIcon, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [
    FormsModule,
    IonButton,
    IonIcon,
    IonInput,
  ],
  providers: [
    // REQUIRED - FOR CONTROL VALUE ACCESSOR
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: InputTextComponent,
    },
  ],
  template: `
    <!-- <div class="ion-margin-top">
      <ion-input
        label="Email (ion-input)"
        label-placement="stacked"
        fill="outline"
        mode="md"
        placeholder="Enter email"
      />
    </div> -->

    <div class="ion-margin-top">
      <div class="label-wrapper">
        {{ label() }}
      </div>
      <div class="main-wrapper">
        <input
          class="native-input"
          type="text"
          [ngModel]="inputValue"
          (ngModelChange)="onValueChange($event)"
          (blur)="onBlur()" />
      </div>
    </div>
    <p>{{inputValue}}</p>

  `,
  styles: `
    :host {
      /*Component CSS variables (maybe overwritten)*/
      
    }

    .label-wrapper {
      font-size: 12px;
      margin-bottom: 5px;
      padding: 0 4px;
    }

    .main-wrapper {
      border: 1px solid var(--ion-color-step-300);
      border-radius: 4px;
      display: flex;
      align-items: center;
      height: 56px;
      padding: 0 16px;
    }

    .native-input {
      background-color: transparent;
      border: none;
      width: 100%;
      outline: none;
    }

  `,
})
export class InputTextComponent implements ControlValueAccessor {

  // INPUTS
  label = input('')


  // OUTPUTS

  // PROPERTIES
  inputValue = 'abc'

  constructor() {}


  // ACTIONS

  onValueChange(newVal: string) {
    if (!this.disabled) {
      this.inputValue = newVal
      this.onChange(newVal)
    }
  }

  onBlur() {
    if (!this.touched) {
      this.touched = true
      this.onTouched()
    }
  }

  // UTILS

  // CONTROL VALUE ACCESSOR INTERFACE

  touched = false;
  disabled = false;
  onChange = (val: string) => {};
  onTouched = () => {};

  writeValue(val: string) {
    // It passes the value which is defined as "initialValue" when creating the FormControl in the parent component.
    this.inputValue = val
  }

  setDisabledState(disabled: boolean) {
    // It passes the value which is defined as "initialValue" when creating the FormControl in the parent component.
    this.disabled = disabled;
  }

  registerOnChange(onChange: (val: string) => void) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => {}) {
    // console.log('registerOnTouched')
    this.onTouched = onTouched;
  }
}
