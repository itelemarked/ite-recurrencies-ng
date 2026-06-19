import { Component, input } from "@angular/core";
import { IonicModule } from '@ionic/angular';


/**
 * AppList is a simple wrapper, to render a common styled list throughout the whole app.
 * Only 'ion-item' children will be rendered via 'ng-content'
 * 
 * INPUTS:
 *  label: string | undefined
 *  errorMessages: string[] | undefined - Every errorMessage is rendered as a list (<ul> and <li> elements)
 *  helperText: string[] | undefined  - Every array items is rendered as paragraph (There is no other means of formatting the text...)
 * 
 * OUTPUTS:
 *  none
 * 
 * CSS PROPERTIES:
 *  --header-color
 *  --items-outline-style
 *  --items-outline-width
 *  --items-outline-color
 *  --footer-color
 */


@Component({
  selector: 'app-list',
  imports: [
    IonicModule
  ],
  template: `
    <div class="header-container">
      {{ label() }}
    </div>

    <ion-list class="items-container" [inset]="true">
      <ng-content select="ion-item"/>
    </ion-list>
      
    <div class="footer-container">
      <div class="errors-container">
        <ul>
          @for(errorMessage of errorMessages(); track errorMessage.toString()) {
            <li>{{ errorMessage }}</li>
          }
        </ul>
      </div>
      <div class="helper-container">
        @for(text of helperText(); track text.toString()) {
          <p>{{text}}</p>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      --header-color: var(--ion-color-medium);
      --items-outline-style: solid;
      --items-outline-width: 1px;
      --items-outline-color: transparent;
      --errors-color: var(--ion-color-danger);
      --footer-color: var(--ion-color-medium);
    }

    :host {
      display: block;
      margin: 16px 0;
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
    }
    
    .errors-container {
      color: var(--errors-color);
    }
    
    .helper-container {
      color: var(--footer-color);
    }
  `]
})
export class AppList {
  label = input<string>()
  errorMessages = input<string[]>()
  helperText = input<string[]>()
}