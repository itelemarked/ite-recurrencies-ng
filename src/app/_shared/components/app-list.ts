import { Component } from "@angular/core";
import { IonicModule } from '@ionic/angular';


/**
 * APP-LIST
 * 
 * Just a container to style the projected contents:
 * - appListHeader
 * - appListItems
 * - appListFooter
 * 
 * The native ion-list styles are overriden to adapt the margins.
 */

@Component({
  selector: 'app-list',
  imports: [
    IonicModule
  ],
  template: `
    <div class="app-list-header">
      <ng-content select="[appListHeader]"/>
    </div>

    <div class="app-list-items">
      <ng-content select="[appListItems]"/>
    </div>

    <div class="app-list-footer">
      <ng-content select="[appListFooter]"/>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      margin: 16px 0;
    } 
    
    :host ::ng-deep ion-list[appListItems] {
      margin: 0;
    }

    .app-list-header {
      margin: 5px 16px;
      font-weight: 600;
      font-size: 0.9em;
      color: var(--ion-color-medium);
    }
    
    .app-list-footer {
      margin: 5px 16px;
      font-weight: 300;
      font-size: 0.8em;
      color: var(--ion-color-medium);
    }
  `]
})
export class AppList {}


