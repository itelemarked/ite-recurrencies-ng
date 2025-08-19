import { Component, input, viewChild } from "@angular/core";
import { IonSpinner } from "@ionic/angular/standalone";

@Component({
  selector: 'app-content-loading',
  standalone: true,
  imports: [
    IonSpinner
  ],
  template: `
    <div class="app-wrapper">
      <ion-spinner class="app-spinner" />
    </div>
  `,
  styles: [`

    /* CSS VARS */
    :host {
      --ite-background-color: yellow;
      --ite-spinner-color: var(--ion-color-primary);
    }

    :host { 
      height: 100%; 
      width: 100%; 
    }

    .app-wrapper {
      height: 100%; 
      width: 100%; 
      background-color: var(--ite-background-color); 
      z-index: 1; 
      display: flex; 
      align-items: center; 
      justify-content: center;
    }

    .app-spinner {
      --color: var(--ite-spinner-color);
    }
  `]
})
export class ContentLoadingComponent {}