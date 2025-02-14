import { NgClass, NgIf } from '@angular/common';
import { Component, input } from '@angular/core';
import { IonList } from '@ionic/angular/standalone';

/**
 * Enhance the ion-list component.
 * Should:
 * - have no margin top and bottom.
 * - extend the properties of the ion-list (same behavior)
 * - accepts header, footer tags as content. When using header and footer tags, it is recommended to use a 'main' tag for presentationnal purpose...
 * - adds custom css variables to style the header and footer (size, weight, color)
 */

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    IonList
  ],
  template: `
    <div class="app-list-wrapper" [ngClass]="{'app-list-inset': inset()}">
      <!-- <div class="app-header" *ngIf="header() !== undefined">{{ header() }}</div> -->
      <div class="app-header">
        <ng-content select="header" />
      </div>
      <ion-list [inset]="inset()" [lines]="lines()" [mode]="mode()">
        <ng-content />
      </ion-list>
      <div class="app-footer">
        <ng-content select="footer" />
      </div>
    </div>
  `,
  styles: `

    header {
      color: red;
    }

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
    }

    .app-header {
      margin: 0 16px 4px 16px;
      font-size: var(--ite-header-font-size);
      font-weight: var(--ite-header-font-weight);
      color: var(--ite-header-color);
    }

    .app-footer {
      margin: 4px 16px 0px 16px;
      font-size: var(--ite-footer-font-size);
      font-weight: var(--ite-footer-font-weight);
      color: var(--ite-footer-color);
    }

    .app-list-inset .app-header,
    .app-list-inset .app-footer {
      padding: 0 16px;
    }

    ion-list {
      margin-top: 0!important;
      margin-bottom: 0!important;
    }
  `,
})
export class ListComponent {
  inset = input<boolean>(false)
  lines = input<'full' | 'inset' | 'none'>()
  mode = input<'ios' | 'md'>()
}




// @Component({
//   selector: 'app-list',
//   standalone: true,
//   imports: [
//     NgIf,
//     NgClass,
//     IonList
//   ],
//   template: `
//     <div class="app-list-wrapper" [ngClass]="{'app-list-inset': inset()}">
//       <div class="app-header" *ngIf="header() !== undefined">{{ header() }}</div>
//       <ion-list [inset]="inset()" [lines]="lines()" [mode]="mode()">
//         <ng-content></ng-content>
//       </ion-list>
//       <div class="app-footer" *ngIf="footer() !== undefined">{{ footer() }}</div>
//     </div>
//   `,
//   styles: `

//     /* CSS VARS */
//     :host {
//       --ite-header-font-size: 0.75em;
//       --ite-header-font-weight: 600;
//       --ite-header-color: var(--ion-color-step-500);

//       --ite-footer-font-size: 0.75em;
//       --ite-footer-font-weight: 300;
//       --ite-footer-color: var(--ion-color-step-500);
//     }

//     :host {
//       display: block;
//     }

//     .app-header {
//       margin: 0 16px 4px 16px;
//       font-size: var(--ite-header-font-size);
//       font-weight: var(--ite-header-font-weight);
//       color: var(--ite-header-color);
//     }

//     .app-footer {
//       margin: 4px 16px 0px 16px;
//       font-size: var(--ite-footer-font-size);
//       font-weight: var(--ite-footer-font-weight);
//       color: var(--ite-footer-color);
//     }

//     .app-list-inset .app-header,
//     .app-list-inset .app-footer {
//       padding: 0 16px;
//     }

//     ion-list {
//       margin-top: 0!important;
//       margin-bottom: 0!important;
//     }
//   `,
// })
// export class ListComponent {
//   inset = input<boolean>(false)
//   lines = input<'full' | 'inset' | 'none'>()
//   mode = input<'ios' | 'md'>()
//   header = input<string>()
//   footer = input<string>()
// }