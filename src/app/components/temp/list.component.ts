import { Component, input } from '@angular/core';
import { IonItem, IonLabel, IonList, IonNote, IonToggle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    IonList
  ],
  template: `
    <div class="list-header">
      <ng-content select="[list-header]" />
    </div>

    <ion-list class="list">
      <ng-content select="[list-items]"/>
    </ion-list>

    <div class="list-footer">
      <ng-content select="[list-footer]" />
    </div>
  `,
  styles: `

    /* CSS VARS */
    :host {

    }

    :host {
      display: block;
      padding: 16px;
    }

    .list-header {
      padding: 0 16px;
      margin-bottom: 6px;
      font-size: 0.75em;
      font-weight: 600;
    }
    
    .list {
      border-radius: 10px;
    }

    .list-footer {
      margin-top: 6px;
      padding: 0 16px;
      font-size: 0.75em;
      color: var(--ion-color-step-500);
    }

    ion-item {
      --background: var(--ion-color-step-50);
    }
  `,
})
export class ListComponent {
  label = input('');
  note = input('');
}
