import { CommonModule, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Directive, forwardRef, inject, input, model, OnDestroy, output, Signal, signal, WritableSignal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { Subject } from 'rxjs';


/**
 * This is a ControlAccessor component. 
 * If used as this (with a FormControl), a disabled attribute can be used as property, and some classes will be set
 * on host element by angular (ng-touched, ng-dirty, etc...)
 * 
 * INPUTS:
 *   - type: 'text' | 'password' (default: 'text')
 *   - label: string (default: '')
 *   - placeholder: string (default: '')
 *   - disabled: boolean (default: false)
 *   - errors: string[] (default: [])
 * 
 * OUTPUTS:
 *   - change: string. Fired everytime a inputs has been made
 *   - blur: void. Fired when blurred.
 */







@Directive({
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ValueAccessorDirective),
      multi: true,
    },
  ],
})
export class ValueAccessorDirective<T> {
  public markAsDirty: () => void = () => {};
  public markAsTouched: () => void = () => {};

  public value = signal<T | undefined>(undefined)
  public disabled = signal<boolean | undefined>(undefined)

  private writeValue(val: T): void {
    this.value.set(val)
  }

  private registerOnChange(fn: any): void {
    this.markAsDirty = fn;
  }

  private registerOnTouched(fn: any): void {
    this.markAsTouched = fn;
  }

  private setDisabledState(val: boolean): void {
    this.disabled.set(val)
  }
}

@Component({
  selector: 'app-input2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    IonButton,
    IonIcon
  ],
  hostDirectives: [ValueAccessorDirective],
  template: `
    
    <input
      style="color: black;"
      [type]="'text'"
      [placeholder]="placeholderInp()"
      [value]="value()"
      (input)="onInput($event)"
      [disabled]="disabled()"
      (blur)="onBlur()"
    />
    <p>value: {{ value() }}</p>
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
// export class AppInput2Component implements ControlValueAccessor {
export class AppInput2Component {

  // INPUTS
  typeInp = input.required<'text' | 'password'>({alias: 'type'})
  labelInp = input<string>('', {alias: 'label'})
  placeholderInp = input<string>('', {alias: 'placeholder'})


  // STATE VARS
  valueAccessor = inject<ValueAccessorDirective<string>>(ValueAccessorDirective)
  value = computed(() => this.valueAccessor.value())
  disabled = computed(() => this.valueAccessor.disabled())

  // disabled = signal<boolean>(true)
  // markAsChanged = () => {} /* When called, sets 'ng-dirty' class on the host component */
  // markAsTouched = () => {} /* When called, sets 'ng-touched' class on the host component */

  constructor() {
    addIcons({eyeOutline, eyeOffOutline})
  }

  ngOnInit() {
    // setTimeout(() => {
    //   console.log('timeout')
    //   this.valueAccessor.markAsChanged()
    //   this.valueAccessor.markAsTouched()
    // }, 2000);
  }

  onInput(e: any) {
    this.valueAccessor.value.set(e.target.value)
  }

  onBlur() {
    this.valueAccessor.markAsTouched()
  }


}


