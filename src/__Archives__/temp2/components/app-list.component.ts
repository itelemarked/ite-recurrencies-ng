import { NgClass, NgIf } from '@angular/common';
import { Component, contentChild, input, ViewEncapsulation } from '@angular/core';
import { IonList } from '@ionic/angular/standalone';

/**
 * A simple wrapper component, which styles <header>, <footer> and <ion-list> components.
 * 
 * 
 * CSS custom properties:
 *   --ite-header-font-size: 0.75em;
 *   --ite-header-font-weight: 600;
 *   --ite-header-color: var(--ion-color-step-500);
 *   --ite-footer-font-size: 0.75em;
 *   --ite-footer-font-weight: 300;
 *   --ite-footer-color: var(--ion-color-step-500);
 */

@Component({
  selector: 'app-list',
  standalone: true,
  encapsulation: ViewEncapsulation.Emulated,
  imports: [],
  template: `
    <ng-content />
  `,
  styles: `

    /* CSS VARS */
    :host {
      --ite-header-font-size: 0.75em;
      --ite-header-font-weight: 600;
      --ite-header-color: var(--ion-color-step-500);

      --ite-footer-font-size: 0.75em;
      --ite-footer-font-weight: 300;
      --ite-footer-color: var(--ion-color-step-500);
    }

    :host {
      display: block;
      margin: 16px 0;
    }

    /* Targets the <ion-list> element inserted as content */
    :host::ng-deep ion-list {
      margin: 0!important;
    }

    /* Targets the <header> element inserted as content */
    :host::ng-deep header {
      margin-bottom: 4px;
      padding: 0 16px;
      font-size: var(--ite-header-font-size);
      font-weight: var(--ite-header-font-weight);
      color: var(--ite-header-color);
    }

    /* Targets the <footer> element inserted as content */
    :host::ng-deep footer {
      margin-top: 4px;
      padding: 0 16px;
      font-size: var(--ite-footer-font-size);
      font-weight: var(--ite-footer-font-weight);
      color: var(--ite-footer-color);
    }
  `,
})
export class AppListComponent {}

