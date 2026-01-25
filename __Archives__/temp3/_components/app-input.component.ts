import { CommonModule } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonButton,
    IonIcon
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: AppInputComponent }
  ],
  template: `
    <div [ngClass]="{'ite-disabled': disabled()}">
      <label class="ite-label">{{ label() }}</label>
      <div class="ite-input-wrapper">
        <input
          class="ite-input"
          [type]="type()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [(ngModel)]="inputValue"
          (blur)="onBlur()"
          (input)="onInput($event)"
        />
        <span class="ite-icon" *ngIf="showIcon()">
          <ion-button fill="clear" color="dark" (click)="toggleShowPassword()">
            <ion-icon slot="icon-only" [name]="iconName()"></ion-icon>
          </ion-button>
        </span>
      </div>
      <div class="ite-errors" color="danger">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: `
    :host {
      /* css variables here: */
      --label-color: inherit;
      --label-color-invalid: var(--ion-color-danger);
      --border-color: var(--ion-color-step-300);
      --border-color-invalid: var(--ion-color-danger);
      --outline-color: var(--ion-color-dark);
      --outline-color-invalid: var(--ion-color-danger);
    }

    :host {
      display: block;
    }

    :host.ng-touched.ng-invalid .ite-input {
      border-color: var(--border-color-invalid);
    }

    :host.ng-touched.ng-invalid .ite-label {
      color: var(--label-color-invalid);
    }

    :host.ng-touched.ng-invalid .ite-input:focus {
      outline-color: var(--label-color-invalid);
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
  typeInp = input.required<'text' | 'password'>({alias: 'type'})
  labelInp = input<string>('', {alias: 'label'})
  placeholderInp = input<string>('', {alias: 'placeholder'})
  disabledInp = input<boolean>(false, {alias: 'disabled'})

  // STATE VARS
  showPassword = signal(false)
  inputValue = ''

  // TEMPLATE VARS
  label = computed(() => this.labelInp())
  placeholder = computed(() => this.placeholderInp())
  type = computed(() => this._type(this.typeInp(), this.showPassword()))
  // iconName = computed(() => this._iconName(this.typeInp(), this.showPassword()))
  iconName = computed(() => {
    const type = this.typeInp()
    const passwordVisible = this.showPassword()
    return type === 'password' && !passwordVisible ? 'eye-outline' : 'eye-off-outline'
  })
  // iconName = computed(() => ((type: 'text' | 'password', passwordVisible: boolean) => {
  //   return type === 'password' && !passwordVisible ? 'eye-outline' : 'eye-off-outline'
  // })(this.typeInp(), this.showPassword()))
  showIcon = computed(() => this._showIcon(this.typeInp()))
  disabled = computed(() => this.accessorDisabled() || this.disabledInp()) // make sure accessor disabled AND template disabled is working...
  toggleShowPassword = () => this.showPassword.set(!this.showPassword())
  onBlur = () => this._onBlur()
  onInput = (e: any) => this._onInput(e.target.value)

  // CONTROL VALUE ACCESSOR
  accessorOnChange = (value: string) => {};
  accessorOnTouched = () => {};
  accessorTouched = false;
  accessorDisabled = signal(false);

  writeValue = (val: string) => this.inputValue = val
  registerOnChange = (fn: (val: string) => void) => this.accessorOnChange = fn
  registerOnTouched = (fn: () => void) => this.accessorOnTouched = fn
  setDisabledState = (disabled: boolean) => this.accessorDisabled.set(disabled)
  // CONTROL VALUE ACCESSOR

  constructor() {
    addIcons({eyeOutline, eyeOffOutline})
  }

  // UTILS
  private _iconName(type: 'text' | 'password', passwordVisible: boolean) {
    return type === 'password' && !passwordVisible ? 'eye-outline' : 'eye-off-outline'
  }

  private _showIcon(type: 'text' | 'password') {
    return type === 'password'
  }

  private _type(type: 'text' | 'password', showPassword: boolean) {
    return type === 'password' && showPassword ? 'text' : type
  }

  private _onBlur() {
    if (!this.accessorTouched) {
      this.accessorOnTouched();
      this.accessorTouched = true;
    }
  }

  private _onInput(val: string) {
    this.accessorOnChange(val)
  }
}