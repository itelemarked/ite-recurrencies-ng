import { Component, input, model } from "@angular/core";
import { FormValueControl, ValidationError, WithOptionalField } from "@angular/forms/signals";
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkOutline } from 'ionicons/icons';

import { AppList } from "./app-list";


/**
 * AppInputSelect is a shortcut of AppList.
 * Note that since the user choose always a valid choice (per definition of select control...), t
 * here won't be any error message when using it within a FormField.
 * 
 * INPUTS:
 *  options: {value: string, text: string}[] (required!)
 *  label: string | undefined
 *  value: string  - the corresponding options is ticked
 *  helperText: string[]
 * 
 * OUTPUTS:
 *  value input as a model...
 * 
 * CSS PROPERTIES:
 *  none
 */


@Component({
  selector: 'app-input-select',
  imports: [
    IonicModule,
    AppList
],
  template: `
    <app-list
      [label]="label()"
      [helperText]="helperText()"
    >
      @for(option of options(); track option.value) {
        <ion-item button [detail]="false" (click)="onItemClick(option.value)">
          <ion-label>{{ option.text }}</ion-label>
          @if(option.value === value()) {
            <ion-icon name="checkmark-outline" slot="end" color="primary"></ion-icon>
          }
        </ion-item>
      }
    </app-list>
  `,
  styles: [``]
})
export class AppInputSelect implements FormValueControl<string | undefined> {

  // INPUTS
  label = input<string>()
  options = input.required<{value: string, text: string}[]>()
  helperText = input<string[]>([])

  // INPUT [FormField]
  readonly value = model<string | undefined>()
  readonly touched = model<boolean>(false)
  readonly errors = input<readonly WithOptionalField<ValidationError>[]>([])

  // TEMPLATE VARS
  protected onItemClick = (value: string) => {
    this.value.set(value)
    this.touched.set(true)
  }

  constructor() {
    addIcons({checkmarkOutline})
  }
}