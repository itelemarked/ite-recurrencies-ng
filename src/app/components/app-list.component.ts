import { NgClass, NgIf } from '@angular/common';
import { Component, contentChild, input } from '@angular/core';
import { IonList } from '@ionic/angular/standalone';

/**
 * Is the very same of using a 'ion-list', with the difference that a <header> and <footer> can be inserted as content.
 * 
 * INSET PROPERTY:
 * The inset property of the 'app-list' (default to true) overrieds the 'inset' property of the 'ion-list' 
 * --> Inset prop of the 'ion-list' has no effect at all!!
 */

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    NgClass,
  ],
  template: `
    <div class="app-list-wrapper" [ngClass]="{'app-list-inset': inset()}">
      <ng-content select="header" />
      <ng-content select="ion-list"/>
      <ng-content select="footer" />
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

    /* Set the margin of the wrapper according to the native ion-list (sets margin in 'inset' is 'true') */
    .app-list-wrapper.app-list-inset {
      margin: 16px;
    }

    /* Force the ion-list margins of the native ion-list element to be 0 (also if 'inset' is 'true') */
    :host::ng-deep ion-list.list-inset {
      margin: 0;
    }

    :host::ng-deep header {
      margin: 16px 16px 4px 16px; /* margin collapse effect on the margin-top property */ 
      font-size: var(--ite-header-font-size);
      font-weight: var(--ite-header-font-weight);
      color: var(--ite-header-color);
    }

    :host::ng-deep footer {
      margin: 4px 16px 16px 16px; /* margin collapse effect on the margin-bottom property */ 
      font-size: var(--ite-footer-font-size);
      font-weight: var(--ite-footer-font-weight);
      color: var(--ite-footer-color);
    }
  `,
})
export class AppListComponent {
  inset = input<boolean>(true)

  ionList = contentChild<IonList>(IonList)

  ngAfterViewInit() {
    this.overrideIonInputInset(this.ionList(), this.inset())
  }

  overrideIonInputInset(ionList: IonList | undefined, hostInset: boolean) {
    if(ionList !== undefined) {
      ionList.inset = hostInset
    }
  }
}

