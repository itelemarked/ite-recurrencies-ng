import { Component, computed, input, model, output } from "@angular/core";
import { 
  FormValueControl,
  WithOptionalField,
  ValidationError 
} from "@angular/forms/signals";
import { IonicModule } from '@ionic/angular';

import { AppList } from "./app-list";


/**
 * AppInputPassword is a shortcut of AppList.
 * 
 * INPUTS:
 *  label: string | undefined
 *  placeholder: string | undefined 
 *  helperText: string[] | undefined  - Every array items is rendered as paragraph (There is no other means of formatting the text...)
 *  formField - alternatively to the FormField directive, properties:
 *                'values' (as model), 
 *                'touched' (as model) and 
 *                'errors' (as InputSignal<readonly WithOptionalField<ValidationError>[]>) 
 *              can be used.
 * 
 * OUTPUTS:
 *  value
 *  touched
 * 
 * CSS PROPERTIES:
 *  none
 */

@Component({
  selector: 'app-input-password',
  imports: [
    IonicModule,
    AppList
  ],
  template: `
    <app-list
      [label]="label()"
      [errorMessages]="errorMessages()"
      [helperText]="helperText()"
      [class.show-errors]="showErrors()"
    >
      <ion-item>
        <ion-input
          type="password"
          [placeholder]="placeholder()"
          [value]="value()"
          (ionInput)="onValueChange($event)"
          (ionBlur)="touched.set(true)"
        >
          <ion-input-password-toggle slot="end"/>
        </ion-input>
      </ion-item>
    </app-list>
  `,
  styles: [`
    .show-errors {
      --items-outline-color: var(--ion-color-danger);
    }
    
    .error-messages {
      color: var(--ion-color-danger);
    }
  `]
})
export class AppInputPassword implements FormValueControl<string> {

  // INPUTS
  label = input<string>()
  placeholder = input<string>()
  helperText = input<string[]>()

  // INPUT [formField]
  readonly value = model<string>('')
  readonly touched = model<boolean>(false)
  readonly errors = input<readonly WithOptionalField<ValidationError>[]>([])

  // TEMPLATE VARS
  protected onValueChange = (e: any) => this.value.set(e.target.value)
  protected showErrors = computed(() => this.errors().length > 0 && this.touched() )
  protected errorMessages = computed(() => this.showErrors() ? this.errors().map(e => e.message!) : [])

}