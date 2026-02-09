import { Component, input, model } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ListComponent } from './app-list.component';

@Component({
  selector: 'app-category-existing',
  standalone: true,
  imports: [IonicModule, ListComponent],
  template: `
    <app-list>
      <ion-radio-group [value]="value()" (ionChange)="updateValue($event.detail.value)">
        @for (option of options(); track option) {
          <ion-item>
            <ion-radio [value]="option">{{ option }}</ion-radio>
          </ion-item>
        }
      </ion-radio-group>
    </app-list>
  `,
  styles: [``],
})
export class CategoryExistingComponent {
  // DEPENDENCIES
  // STATE
  options = input.required<string[]>();
  value = model<string | null>()
  
  // SELECTORS
  // ACTIONS
  updateValue(e: string) {
    this.value.set(e)
  }
  // PRIVATE
}
