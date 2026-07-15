import { Component } from "@angular/core";
import { IonicModule } from '@ionic/angular';

/**
 * AppList1 is a simple wrapper, to render a common styled list throughout the whole app.
 * Use it INSTEAD OF ion-list!
 * 
 * It uses ionic component under the hood and restyle these where needed.
 * Accepted children are (and only these, others won't be displayed!):
 *    - ion-header (usually only one!)
 *    - ion-items, or ion-radio-group, or ion-item-sliding (the items to be displayed, as many as needed. 
 *      They could be mixed together, althought it is not recommended since it can lead to unexpected styling, e.g when mixing ion-items with ion-radio-group.....)
 *    - ion-footer (as many as needed, e.g for one for helper-text and one for errors)
 * 
 * INPUTS:
 *  none
 * 
 * OUTPUTS:
 *  none
 * 
 * CSS PROPERTIES:
 *  --header-color: var(--ion-color-medium);
 *  --items-outline-style: solid;
 *  --items-outline-width: 1px;
 *  --items-outline-color: transparent;
 *  --footer-color: var(--ion-color-medium);
 * 
 * @example
 * <app-list1>
 * 
 *   <ion-header>Title</ion-header>
 * 
 *   <ion-item button>aaa</ion-item>
 * 
 *   <ion-item>
 *     <ion-label>
 *       <h2>h2</h2>
 *       <p>p</p>
 *     </ion-label>
 *     <ion-note>note</ion-note>
 *   </ion-item>
 * 
 *   <ion-item>
 *     <ion-input type="text"/>
 *   </ion-item>
 * 
 *   <ion-footer>this is some footer text 1</ion-footer>
 * 
 *   <ion-footer>
 *     <ion-text color="danger">this is some footer text 2</ion-text>
 *   </ion-footer>
 * 
 * </app-list1>
 */

@Component({
  selector: 'app-list1',
  imports: [
    IonicModule
  ],
  template: `
    <div class="header-container">
      <ng-content select="ion-header"/>
    </div>

    <ion-list class="items-container" [inset]="true">
      <ng-content select="ion-item, ion-radio-group, ion-item-sliding"/>
    </ion-list>
      
    <div class="footer-container">
      <ng-content select="ion-footer"/>
    </div>
  `,
  styles: [`
    :host {
      --header-color: var(--ion-color-medium);
      --items-outline-style: solid;
      --items-outline-width: 1px;
      --items-outline-color: transparent;
      --footer-color: var(--ion-color-medium);
    }

    :host {
      display: block;
      margin: 16px;
    }

    .header-container {
      margin: 5px 16px;
      font-weight: 600;
      font-size: 0.9em;
      color: var(--header-color);
    }

    ion-list.items-container {
      margin: 0;
      outline-style: var(--items-outline-style);
      outline-width: var(--items-outline-width);
      outline-color: var(--items-outline-color);
    }
    
    .footer-container {
      margin: 5px 16px;
      font-weight: 300;
      font-size: 0.8em;
      color: var(--footer-color);
    }
  `]
})
export class AppList1 {}