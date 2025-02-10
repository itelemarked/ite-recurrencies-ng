
import { Component, input, model } from '@angular/core';
import { IonItem, IonToggle } from '@ionic/angular/standalone';



@Component({
  selector: 'app-item-toggle',
  standalone: true,
  imports: [
    IonItem,
    IonToggle
  ],
  template: `
    <ion-item part="ion-item">
      <ion-toggle [checked]="checked()">{{ label() }}</ion-toggle>
    </ion-item>
  `,
  styles: `

    ion-item {
      --ite-background: var(--ion-color-step-50);
      // --ite-background: red;
    }

    ion-item {
      --background: var(--ite-background)
    }
  `,
})

export class ItemToggleComponent {
  label = input('')
  checked = model<boolean>(false)
}