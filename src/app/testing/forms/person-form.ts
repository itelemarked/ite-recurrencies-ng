import { Component, signal } from '@angular/core';
import { form, FormField, pattern, required, validate } from '@angular/forms/signals';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-person-form',
  imports: [IonicModule, FormField],
  template: `
    <ion-list [inset]="true">
      <ion-item [class.invalid]="!personForm.name().valid()">
        <ion-input placeholder="Enter a name" [formField]="personForm.name" />
      </ion-item>
      <ion-item [class.invalid]="!personForm.age().valid()">
        <ion-input placeholder="Enter an age" [formField]="personForm.age" />
      </ion-item>
    </ion-list>

    <div>name errors:</div>
    <ul>
      @for (error of personForm.name().errors(); track error.message) {
        <li>{{ error.message }}</li>
      }
    </ul>

    <div>age errors:</div>
    <ul>
      @for (error of personForm.age().errors(); track error.message) {
        <li>{{ error.message }}</li>
      }
    </ul>
    
  `,
  styles: [
    `
      ion-item.invalid {
        --color: red;
      }
    `,
  ],
})
export class PersonForm {

  protected personModel = signal({
    name: '',
    age: '99',
  });

  personForm = form(this.personModel, (schemaPath) => {
    required(schemaPath.name, {message: 'name is required'}),
    pattern(schemaPath.name, /^aaa$/, { message: 'is not aaa' }),
    validate(schemaPath.age, ({ value }) => {
    // if(Number.isNaN(value())) return {kind: 'a', message: 'must be a number'}
    if (+value() < 18) return { kind: 'b', message: 'must be greater or equal to 18' };
    return null;
    });
  });

}
