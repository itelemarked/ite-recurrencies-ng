import { Component, computed, inject, signal } from "@angular/core";
import { IonicModule } from '@ionic/angular';
import { RecurrencyService } from "../../recurrencies/services/recurrency-service";
import { SettingsService } from "../../recurrencies/services/settings-service";

@Component({
  selector: 'app-testing-recurrency-service',
  imports: [
    IonicModule
  ],
  template: `
    <div data-HOST style="margin: 10px;">

      <div data-SETTINGS>
        <h5>Settings</h5>
        <div style="border: 1px solid grey; padding: 10px;display: flex; align-items: center;">
          <div style="width: 80%; font-size: 0.8em;">
            timezone: {{ settingsService.settings().timezone }} <br>
            dateFormat: {{ settingsService.settings().dateFormat }}
          </div>
          <div>
            <ion-button size="small">edit</ion-button>
          </div>
        </div>
      </div>

      <div data-RECURRENCIES>
        <h5>Recurrencies</h5>
        @for(rec of recurrencies(); track rec.uid) {
          <div style="border: 1px solid grey; padding: 10px; display: flex; align-items: center; margin: 5px 0;">
            <div style="width: 80%; font-size: 0.8em;">
              uid: {{ rec.uid }} <br>
              title: {{ rec.title }} <br>
              lastEvent: {{ rec.lastEvent.toString() }} <br>
              periodNb: {{ rec.periodNb }} <br>
              periodUnit: {{ rec.periodUnit }} <br>
              category: {{ rec.category }} 
            </div>
            <div>
              <ion-button size="small" color="danger">delete</ion-button> <br>
              <ion-button size="small">edit</ion-button>
            </div>
          </div>
        }
        <div style="display: flex; align-items: center; border: 1px solid grey; margin: 10px 0;">
          <div style="width: 80%;">
            <ion-input
            type="text"
              [value]="addForm.title()"
              (ionInput)="addForm.title.set($event.detail.value!)"
              placeholder="Title"
            />
            <ion-input
            type="text"
              [value]="addForm.lastEvent()"
              (ionInput)="addForm.lastEvent.set($event.detail.value!)"
              placeholder="LastEvent"
            />
            <ion-input
            type="text"
              [value]="addForm.periodNb()"
              (ionInput)="addForm.periodNb.set($event.detail.value!)"
              placeholder="Period Nb"
            />
            <ion-input
            type="text"
              [value]="addForm.periodUnit()"
              (ionInput)="addForm.periodUnit.set($event.detail.value!)"
              placeholder="Period Unit"
            />
            <ion-input
            type="text"
              [value]="addForm.category()"
              (ionInput)="addForm.category.set($event.detail.value!)"
              placeholder="Category"
            />
          </div>
          <div>
            <ion-button size="small" (click)="onAddRecurrency()">add</ion-button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [``]
})
export class TestingRecurrencyService {
  // DEPENDENCIES
  recurrencyService = inject(RecurrencyService)
  settingsService = inject(SettingsService)

  // STATE
  addForm = {
    title: signal(''),
    lastEvent: signal(''),
    periodNb: signal(''),
    periodUnit: signal(''),
    category: signal('')
  }

  // SELECTORS
  recurrencies = computed(() => this.recurrencyService.recurrencies())

  // ACTIONS
  onAddRecurrency = () => {
    
  }

  // PRIVATE

}