
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';


/**
 * A custom input of type text.
 * 
 * The errors and styling (css) must be set in the parent form component.
 * Since it is intended to be used with ReactiveForms, there are no outputs for this component.
 * 
 * Inputs:
 *  - type: 'text' | 'password' (required)
 *  - label: string (optional, default '')
 *  - placeholder: string (optional, default '')
 *  
 *  - RMK: 'value' and 'disabled' attrbute must be handled in the Formcontrol and not in the template.
 * 
 * CSS custom properties:
 *  --label-color
 *  --border-color
 *  --outline-color
 */



@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    IonButton,
    IonIcon
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: AppInputComponent }
  ],
  template: `
    <div>
      <label class="ite-label">{{ labelInput() }}</label>
      <div class="ite-input-wrapper">
        <input
          class="ite-input"
          [ngClass]="{'ite-disabled': disabled}"
          [type]="type()"
          [value]="value"
          [disabled]="disabled"
          [placeholder]="placeholderInput()"
          (blur)="onBlur()"
          (input)="onInput($event)"
        />
        <span class="ite-icon" *ngIf="typeInput() === 'password'">
          <ion-button fill="clear" color="dark" (click)="toggleIsMasked()">
            <ion-icon slot="icon-only" [name]="isMasked() ? 'eye-outline' : 'eye-off-outline'"></ion-icon>
          </ion-button>
        </span>
        <div class="ite-errors">
          <div *ngFor="let errorMessage of errorMessages()">{{ errorMessage }}</div>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      /* css variables here: */
      --label-color: inherit;
      --border-color: var(--ion-color-step-300);
      --outline-color: var(--ion-color-dark);
    }

    :host {
      display: block;
    }

    .ite-disabled {
      opacity: 0.5;
    }

    .ite-input-wrapper {
      position: relative;
    }

    .ite-label {
      display: block;
      padding-left: 10px;
      font-size: 0.75em;
      margin-bottom: 5px;
      color: var(--label-color);
    }

    .ite-input {
      display: block;
      background-color: transparent;
      border-width: 1px;
      border-style: solid;
      border-color: var(--border-color);
      border-radius: 4px;
      height: 56px;
      width: 100%;
      padding-left: 10px;
      padding-right: 65px;
      outline: none;
    }

    .ite-input:focus {
      border: none;
      outline-width: 2px;
      outline-style: solid;
      outline-color: var(--outline-color);
    }

    .ite-icon {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 10;
    }

    .ite-errors {
      display: block;
      font-size: 0.75em;
      margin-top: 6px;
      padding-left: 10px;
      color: var(--ion-color-danger);
    }
  `,
})
export class AppInputComponent implements ControlValueAccessor {

  // INPUTS
  typeInput = input.required<'text' | 'password'>({alias: 'type'})
  labelInput = input<string>('', {alias: 'label'})
  placeholderInput = input<string>('', {alias: 'placeholder'})
  errorMessages = input<string[]>([])

  // OUTPUTS
  input = output<string>()
  blur = output<void>()

  // STATE VARS
  isMasked = signal(true)

  // TEMPLATE VARS
  

  // TEMPLATE ACTIONS
  onBlur = () => {
    if (!this.touched) {
      this.accessorOnTouched();
      this.touched = true;
    }
    this.blur.emit()
  }

  onInput = (e: any) => {
    this.accessorOnChange(e.target.value)
    this.input.emit(e.target.value)
  }

  toggleIsMasked = () => this.isMasked.update(val => !val)

  // COMPUTED VARS
  type = computed(() => this.typeInput() === 'password' && this.isMasked() === true ? 'password' : 'text')
  
  constructor() {
    addIcons({eyeOutline, eyeOffOutline})
  }


  // CONTROL VALUE ACCESSOR
  touched = false;
  disabled = false;
  value = '';
  accessorOnChange = (value: string) => {};
  accessorOnTouched = () => {};

  writeValue = (val: string) => this.value = val
  registerOnChange = (fn: (val: string) => void) => this.accessorOnChange = fn
  registerOnTouched = (fn: () => void) => this.accessorOnTouched = fn
  setDisabledState = (disabled: boolean) => this.disabled = disabled
  // CONTROL VALUE ACCESSOR


}