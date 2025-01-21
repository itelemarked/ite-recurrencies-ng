import { CommonModule } from '@angular/common';
import { Component, computed, input, InputSignal, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonButton, IonIcon, IonInput, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-auth-input-control',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonInput,
    IonButton,
    IonText,
    IonIcon
  ],
  template: `
    <div>
      <div style="position: relative;">
        <!-- [formControl]="confirmPasswordCtl" -->
        <ion-input
          class="override ionic styles"
          [type]="nativeType()"
          [label]="label()"
          [placeholder]="placeholder()"
          label-placement="stacked"
          fill="outline"
          mode="md"
        >
        </ion-input>
        <span *ngIf="showIcon()" class="absolute top-0 right-0 z-10">
          <ion-button fill="clear" color="dark" (click)="toggleShowPassword()">
            <ion-icon slot="icon-only" [name]="iconName()"></ion-icon>
          </ion-button>
        </span>
      </div>
      <ion-text class="block text-xs pt-sm" color="danger">
        <ng-content></ng-content>
        <!-- <ion-text color="danger" class="block" *ngIf="confirmPasswordCtl.touched && confirmPasswordCtl.hasError('required')">Enter a password...</ion-text>
        <ion-text color="danger" class="block" *ngIf="form.touched && form.touched && form.hasError('controlsMismatch-passwordCtl-confirmPasswordCtl')">Missmatch</ion-text> -->
      </ion-text>
    </div>
  `,
  styles: `
    :host {
      /* css variables here: */
      /* --border-color: var(--ion-color-dark);
      --border-color-invalid: var(--ion-color-danger); */
    }

    :host {
      display: block;
    }

    ion-input.override.ionic.styles {
      /* --border-color: yellow; border. When set, it overrides the focused border color. */
      /* --highlight-color: yellow; border, label, cursor when focused */
      /* --color: yellow; label and text */

      /* --highlight-color: magenta;  label, cursor and border. Overriden if --border-color set... strange... */
      /* --border-color: yellow; */
      /* --color: cyan; label and text. When focused, label takes the color of --highlight-color... strange... */
      /* --highlight-color-focused: red; */
    }
  `,
})
export class AuthInputControlComponent {

  // INPUTS
  typeInp = input.required<'text' | 'password'>({alias: 'type'})
  labelInp = input<string>('', {alias: 'label'})
  placeholderInp = input<string>('', {alias: 'placeholder'})

  // STATE VARS
  passwordVisible = signal(false)

  // TEMPLATE VARS
  label = computed(() => this.labelInp())
  placeholder = computed(() => this.placeholderInp())
  iconName = computed(() => this._iconName(this.typeInp(), this.passwordVisible()))
  showIcon = computed(() => this._showIcon(this.typeInp()))
  nativeType = computed(() => this._nativeType(this.typeInp(), this.passwordVisible()))
  toggleShowPassword = () => this.passwordVisible.set(!this.passwordVisible())

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

  private _nativeType(type: 'text' | 'password', passwordVisible: boolean) {
    return type === 'password' && passwordVisible ? 'text' : type
  }

}