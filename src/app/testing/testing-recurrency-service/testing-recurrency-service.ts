import { Component, computed, inject, signal } from "@angular/core";
import { IonicModule } from '@ionic/angular';
import { RecurrencyService } from "../../recurrencies/services/recurrency-service";
import { SettingsService } from "../../recurrencies/services/settings-service";
import { DateString } from "../../../js/timezone-date/types/DateString";
import { PeriodUnit } from "../../../js/timezone-date/types/PeriodUnit";
import { PositiveInteger } from "../../../js/timezone-date/types/PositiveInteger";
import { Recurrency } from "../../recurrencies/types/Recurrency";
import { Identifiable } from "../../recurrencies/types/Identifiable";

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
              <ion-button size="small" color="danger" (click)="onDeleteRecurrency(rec.uid)">delete</ion-button> <br>
              <ion-button size="small" (click)="onEditClick(rec)">edit</ion-button>
            </div>
          </div>
        }
        <div style="display: flex; align-items: center; border: 1px solid grey; margin: 10px 0;">
          <div style="width: 80%;">
            @if(mode() === 'update') {
              <ion-button size="small" (click)="mode.set('add'); addForm.uid.set('')">add mode</ion-button>
              <ion-input
                type="text"
                [value]="addForm.uid()"
                (ionInput)="addForm.title.set($event.detail.value!)"
                placeholder="uid"
                [disabled]="true"
              />
            }
            <ion-input
              type="text"
              [value]="addForm.title()"
              (ionInput)="addForm.title.set($event.detail.value!)"
              placeholder="Title"
            />
            <ion-input
              type="text"
              [value]="addForm.lastEventString()"
              (ionInput)="addForm.lastEventString.set($event.detail.value!)"
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
            <ion-button size="small" (click)="onAddOrUpdate()">{{ mode() === 'add' ? 'add' : 'update' }}</ion-button>
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
  mode = signal<'add' | 'update'>('add')
  addForm = {
    uid: signal(''),
    title: signal(''),
    lastEventString: signal(''),
    periodNb: signal(''),
    periodUnit: signal(''),
    category: signal('')
  }

  // SELECTORS
  recurrencies = computed(() => this.recurrencyService.recurrencies())

  // ACTIONS
  onAddOrUpdate = () => {
    
  }

  onDeleteRecurrency = (uid: string) => this.recurrencyService.deleteDoc(uid)

  onEditClick = (recurrency: Identifiable<Recurrency>) => {
    this.mode.set('update')

    const {uid} = recurrency
    this.addForm.uid.set(uid)
    this.addForm.title.set('')
    this.addForm.lastEventString.set('')
    this.addForm.periodNb.set('')
    this.addForm.periodUnit.set('')
    this.addForm.category.set('')
    // this.addForm.title.set(title)
    // this.addForm.lastEventString.set(lastEvent.dateString())
    // this.addForm.periodNb.set(periodNb.toString())
    // this.addForm.periodUnit.set(periodUnit)
    // this.addForm.category.set(category)
  }

  // PRIVATE
  _addRecurrency = () => this.recurrencyService.addDoc({
      title: this.addForm.title(),
      lastEventString: this.addForm.lastEventString() as DateString,
      periodNb: +this.addForm.periodNb() as PositiveInteger,
      periodUnit: this.addForm.periodUnit() as PeriodUnit,
      category: this.addForm.category()
    })

  _updateRecurrency = () => {
    const opts: any = {}
    if(this.addForm.title().trim() !== '') opts.title = this.addForm.title()
    if(this.addForm.lastEventString().trim() !== '') opts.lastEventString = this.addForm.lastEventString()
    if(this.addForm.title().trim() !== '') opts.title = this.addForm.title()
    if(this.addForm.title().trim() !== '') opts.title = this.addForm.title()
    if(this.addForm.title().trim() !== '') opts.title = this.addForm.title()
    this.recurrencyService.updateDoc(this.addForm.uid(), opts)
  }
}