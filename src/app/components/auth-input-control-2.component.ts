import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, input, InputSignal, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { IonButton, IonIcon, IonInput, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-auth-input-control-2',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonButton,
    IonText,
    IonIcon
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: AuthInputControl2Component }
  ],
  template: `
    <div>
      <label class="ite-label">{{ label() }}</label>
      <div class="ite-input-wrapper">
        <input
          class="ite-input"
          [type]="type()"
          [placeholder]="placeholder()"
          [disabled]="disabled"
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
export class AuthInputControl2Component implements ControlValueAccessor {

  // // INPUTS
  typeInp = input.required<'text' | 'password'>({alias: 'type'})
  labelInp = input<string>('', {alias: 'label'})
  placeholderInp = input<string>('', {alias: 'placeholder'})


  // // STATE VARS
  showPassword = signal(false)
  inputValue = ''

  // // TEMPLATE VARS
  label = computed(() => this.labelInp())
  placeholder = computed(() => this.placeholderInp())
  type = computed(() => this._type(this.typeInp(), this.showPassword()))
  iconName = computed(() => this._iconName(this.typeInp(), this.showPassword()))
  showIcon = computed(() => this._showIcon(this.typeInp()))
  toggleShowPassword = () => this.showPassword.set(!this.showPassword())
  onBlur = () => this._onBlur()
  onInput = (e: any) => this._onInput(e.target.value)

  // CONTROL VALUE ACCESSOR
  onChange = (value: string) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;

  writeValue = (val: string) => this.inputValue = val
  registerOnChange = (fn: (val: string) => void) => this.onChange = fn
  registerOnTouched = (fn: () => void) => this.onTouched = fn
  setDisabledState = (disabled: boolean) => this.disabled = disabled
  // CONTROL VALUE ACCESSOR

  constructor() {
    addIcons({eyeOutline, eyeOffOutline})
  }

  // // UTILS
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
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  private _onInput(val: string) {
    this.onChange(val)
  }
}