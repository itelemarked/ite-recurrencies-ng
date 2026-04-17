
import { Component, computed, input, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';


/**
 * app-list
 * 
 * An enhancement of the ion-list component.
 * The native ion-list has following changes: 
 *  - Top and bottom margins are set thinner.
 * 
 * PROPS:
 *  - title (optional): string | undefined (default: undefined).  The title of the list    
 *  - errors: string[] (default = []).                            An unordered list of errors                        
 *  - helperText: string | undefined (default: undefined).        Some text to help the user. It is only shown in case there aren't any errors!
 */
@Component({
  selector: 'app-list',
  imports: [IonicModule],
  template: `
    <div class="app-list-header">{{ title() }}</div>
    <ion-list 
      class="app-list-ion-list"
      [class.has-errors]="hasErrors()"
      [inset]="true"
    >
      <ng-content></ng-content>
    </ion-list>
    <div class="app-list-footer">
      @if(hasErrors()) {
        <ul class="app-list-footer-errors">
          @for(error of errors(); track error) {
            <li>{{ error }}</li>
          }
        </ul>
      }
      @else {
        <div class="app-list-footer-helper">{{ helperText() }}</div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      margin: 16px 0;
    }

    ul {
      padding: 0;
      margin: 0;
    }

    .app-list-ion-list {
      margin-top: 8px;
      margin-bottom: 8px;
    }

    .app-list-ion-list.has-errors {
      border: 1px solid var(--ion-color-danger);
    }

    .app-list-header {
      margin: 0 16px;
      padding: 0 16px;
      font-weight: 600;
      color: var(--ion-color-medium);
    }

    .app-list-footer {
      margin: 0 16px;
      padding: 0 16px;
      font-weight: 300;
      font-size: 0.75em;
    }
    
    .app-list-footer-helper {
      color: var(--ion-color-medium);
    }

    .app-list-footer-errors {
      color: var(--ion-color-danger);
    }
  `],
})
export class ListComponent {
  // DEPENDENCIES
  // STATE
  title = input<string | undefined>()
  errors = input<string[]>([])
  helperText = input<string | undefined>()

  // title = signal<string | undefined>('A Title')
  // errors = signal<string[]>(['err1', 'err2'])
  // // errors = signal<string[]>([])
  // // helperText = signal<string | undefined>('This is a helper text for the user')
  // helperText = signal<string | undefined>(undefined)

  // SELECTORS
  protected hasErrors = computed(() => this.errors().length > 0)
  // ACTIONS
  // PRIVATE
}
