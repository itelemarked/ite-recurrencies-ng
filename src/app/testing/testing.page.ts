import { Component, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { form, required } from '@angular/forms/signals';
import { DateTimezoneOptions } from '../settings/components/date-timezone-options';
import { Timezone } from '../../js/timezone-date/types/Timezone';




@Component({
  selector: 'app-testing-page',
  imports: [IonicModule, DateTimezoneOptions],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="ion-padding-horizontal">

      <app-date-timezone-options
        [(value)]="optValue"
      />

      <p>value: {{ optValue() }}</p>

    </ion-content>
  `,
  styles: [``],
})
export class TestingPage {
  optValue = signal<Timezone | undefined>('Europe/Zurich')

  model = signal<{opts: string}>({
    opts: ''
  })

  form = form(this.model, (schema) => {
    required(schema.opts, { message: 'An options must be chosen...'})
  })

}

