import { CommonModule } from '@angular/common';
import { Component, computed, input, Signal } from '@angular/core';
import { IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';
import { ReplaceDirective } from './replace.directive';



@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    IonItem,
    IonLabel,
    IonNote
  ],
  template: `
    <ion-item part="ion-item">
      <ion-label>{{ label() }}</ion-label>
      <ion-note>{{ note() }}</ion-note>
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

export class ItemComponent {
  label = input('')
  note = input('')
}