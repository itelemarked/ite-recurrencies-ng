import { Component, computed, signal, viewChild } from '@angular/core';
import { form, FormField, pattern, required, validate } from '@angular/forms/signals';
import { IonicModule, IonInput } from '@ionic/angular';

@Component({
  selector: 'app-person-form2',
  imports: [IonicModule, FormField],
  template: `
    <ion-list [inset]="true">
      <ion-item [class.invalid]="nameCtl.errors().length > 0">
        <ion-input
          placeholder="Enter a name"
          [value]="nameCtl.value()"
          (ionInput)="nameCtl.value.set($event.detail.value!)"
        />
      </ion-item>
      <ion-item [class.invalid]="ageCtl.errors().length > 0">
        <ion-input
          placeholder="Enter an age" 
          [value]="ageCtl.value()"
          (ionInput)="ageCtl.value.set($event.detail.value!)"
        />
      </ion-item>
    </ion-list>

    @if(nameCtl.errors().length > 0) {
      <div>name errors:</div>
      <ul>
        @for (error of nameCtl.errors(); track error.message) {
          <li>{{ error.message }}</li>
        }
      </ul>
    }

    @if(ageCtl.errors().length > 0) {
      <div>age errors:</div>
      <ul>
        @for (error of ageCtl.errors(); track error.message) {
          <li>{{ error.message }}</li>
        }
      </ul>
    }
  `,
  styles: [
    `
      ion-item.invalid {
        --color: red;
      }
    `,
  ],
})
export class PersonForm2 {

  protected nameCtl = {
    value: signal('abc'),
    showErrors: signal(false),
    errors: computed(() => {
      const val = this.nameCtl.value()
      const showErrors = this.nameCtl.showErrors()

      const errors = []
      if (val.trim() === '' && showErrors) {
        errors.push({ message: 'Name is required' })
      } else if (!/^aaa$/.test(val) && showErrors) {
        errors.push({ message: 'Must be aaa' })
      }
      return errors
    }),
  }

  protected ageCtl = {
    value: signal('0'),
    showErrors: signal(false),
    errors: computed(() => {
      const val = this.ageCtl.value()
      const showErrors = this.ageCtl.showErrors()

      const errors = []
      if (isNaN(+val) && showErrors) {
        errors.push({ message: 'Must be numeric' })
      } else if (+val < 18 && showErrors) {
        errors.push({ message: 'Must be at least 18' })
      }
      return errors
    }),
  }

  showErrors(val: boolean) {
    this.nameCtl.showErrors.set(val)
    this.ageCtl.showErrors.set(val)
  }

  name = computed(() => this.nameCtl.value())
  age = computed(() => this.ageCtl.value())

}
