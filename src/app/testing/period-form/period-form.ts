import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-period-form',
  imports: [IonicModule, FormField],
  template: `
    <div>Period Number</div>
    <ion-list [inset]="true">
      <ion-item [class.invalid]="periodNbCtl.hasErrors() && showErrors()">
        <ion-input placeholder="Enter a number" [formField]="form.periodNb" />
      </ion-item>
    </ion-list>
    <div class="period-nb-errors errors">
      @if (periodNbCtl.hasErrors() && showErrors()) {
        <ul>
          @for (error of periodNbCtl.errors(); track error.message) {
            <li>{{ error.message }}</li>
          }
        </ul>
      }
    </div>

    <div>Period Unit</div>
    <ion-list [inset]="true">
      <ion-radio-group [formField]="form.periodUnit">
        <ion-item [class.invalid]="form.periodUnit().errors().length > 0 && showErrors()">
          <ion-radio value="days">Day(s)</ion-radio>
        </ion-item>
        <ion-item [class.invalid]="form.periodUnit().errors().length > 0 && showErrors()">
          <ion-radio value="weeks">Week(s)</ion-radio>
        </ion-item>
        <ion-item [class.invalid]="form.periodUnit().errors().length > 0 && showErrors()">
          <ion-radio value="months">Month(s)</ion-radio>
        </ion-item>
        <ion-item [class.invalid]="form.periodUnit().errors().length > 0 && showErrors()">
          <ion-radio value="years">Year(s)</ion-radio>
        </ion-item>
      </ion-radio-group>
    </ion-list>
    <div class="period-unit-errors errors">
      @if (form.periodUnit().errors().length > 0 && showErrors()) {
        <ul>
          @for (error of form.periodUnit().errors(); track error.message) {
            <li>{{ error.message }}</li>
          }
        </ul>
      }
    </div>
  `,
  styles: [
    `
      .errors {
        color: var(--ion-color-danger);
        font-size: 0.8em;
      }

      ion-item.invalid {
        --color: var(--ion-color-danger);
      }
    `,
  ],
})
export class PeriodForm {
  // DEPENDENCIES
  // STATE
  periodNbInput = input<number | undefined>(undefined, { alias: 'periodNb' });
  periodUnitInput = input<string | undefined>(undefined, { alias: 'periodUnit' });
  showErrors = input<boolean>(true)

  private periodModel = linkedSignal(() => ({
    periodNb: this.periodNbInput() === undefined ? '' : this.periodNbInput()!.toString(),
    periodUnit: this.periodUnitInput() === undefined ? '' : this.periodUnitInput()!,
  }));

  protected form = form(this.periodModel, (schema) => {
    required(schema.periodNb, { message: 'Required field' });
    required(schema.periodUnit, { message: 'Required field' });
  });

  // SELECTORS
  periodNbCtl = {
    hasErrors: computed(() => this.form.periodNb().errors().length > 0),
    errors: computed(() => this.form.periodNb().errors()),
    control: computed(() => this.form.periodNb)
  }

  // ACTIONS
  // PRIVATE
}
