import { Component, computed, input, model, output } from "@angular/core";
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-child',
  imports: [
    IonicModule
  ],
  template: `
    <ion-list [inset]="true">
      <ion-item>
        <ion-input
          type="text"
          label="value"
          [value]="value()"
          (ionInput)="onValueChange($event)"
        />
      </ion-item>
    </ion-list>
    <p>
      value from child: {{ value() }}
    </p>
  `,
  styles: [``]
})
export class Child {
  // DEPENDENCIES

  // STATE
  // value = model.required<string>()
  value = input.required<string>()
  valueChange = output<string>()

  // SELECTORS

  // ACTIONS
  onValueChange = (e: any) => {
    this.valueChange.emit(e.detail.value)
  }

  // PRIVATE

}