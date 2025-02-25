
import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, input, model, output, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { AppValueAccessorDirective } from './temp/app-value-accessor.directive';

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
  hostDirectives: [AppValueAccessorDirective],
  template: `
    <div [ngClass]="{'ite-disabled': valueAccessorDisabled()}">
      <label class="ite-label">{{ labelInp() }}</label>
      <div class="ite-input-wrapper">
        <input
          class="ite-input"
          [type]="typeInp() === 'password' && showPassword() === false ? 'password' : 'text'"
          [placeholder]="placeholderInp()"
          [value]="valueAccessor.getValue()"
          [disabled]="valueAccessor.getDisabled()"
          (input)="onInput($event)"
          (blur)="valueAccessor.markAsTouched()"
        />
        <span class="ite-icon" *ngIf="showIcon()">
          <ion-button fill="clear" color="dark" (click)="onToggleShowPassword()">
            <ion-icon slot="icon-only" [name]="iconName()"></ion-icon>
          </ion-button>
        </span>
      </div>
      <div class="ite-errors" color="danger">
        @for (error of errorsInp(); track error) {
          <div>{{ error }}</div>
        }
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
      --outline-width: 2px;
    }

    :host {
      display: block;
      margin: 16px var(--outline-width)
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
      outline-width: var(--outline-width);
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
      margin-top: 5px;
      padding-left: 10px;
      color: var(--ion-color-danger);
    }
  `,

})
export class AppInputComponent {

  // DEPENDENCIES
  valueAccessor = inject<AppValueAccessorDirective<string>>(AppValueAccessorDirective)

  // INPUTS
  typeInp = input.required<'text' | 'password'>({alias: 'type'})
  labelInp = input<string>('', {alias: 'label'})
  placeholderInp = input<string>('', {alias: 'placeholder'})
  errorsInp = input<string[]>([], {alias: 'errors'})

  // STATE VARS
  showPassword = signal(false)

  // TEMPLATE VARS
  valueAccessorDisabled = computed(() => this.valueAccessor.getDisabled())

  showIcon = computed(() => {
    const type = this.typeInp()
    return type === 'password'
  })

  iconName = computed(() => {
    const showPassword = this.showPassword()
    return showPassword ? 'eye-off-outline' : 'eye-outline'
  })

  onInput = (e: any) => this.valueAccessor.emitValue(e.target.value)
  onToggleShowPassword = () => this.showPassword.update(val => !val)

  constructor() {
    addIcons({eyeOffOutline, eyeOutline})
  }

}