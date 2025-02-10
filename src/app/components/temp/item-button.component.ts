import { CommonModule } from '@angular/common';
import { Component, computed, input, Signal } from '@angular/core';
import { IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';
import { ReplaceDirective } from './replace.directive';



@Component({
  selector: 'app-item-button',
  standalone: true,
  imports: [
    IonItem,
    IonLabel,
    IonNote
  ],
  // hostDirectives: [ReplaceDirective],
  template: `
    <ion-item [button]="true">
      <ion-label>{{ label() }}</ion-label>
      <ion-note>{{ note() }}</ion-note>
    </ion-item>
  `,
  styles: `
    ion-item {
      --ite-background: var(--ion-color-step-50);
    }

    ion-item {
      --background: var(--ite-background)
    }
  `,
})

export class ItemButtonComponent {
  label = input('')
  note = input('')
}