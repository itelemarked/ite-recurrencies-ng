import { Component, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { form, required } from '@angular/forms/signals';
import { Timezone } from '../../js/timezone-date/types/Timezone';
import { AppList1 } from './list/app-list1/app-list1';




@Component({
  selector: 'app-testing-page',
  imports: [IonicModule, AppList1],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">

      <app-list1>
        <ion-header>Title</ion-header>
        <ion-item button>aaa</ion-item>
        <ion-item-sliding>
          <ion-item>
            <ion-label>
              <h2>h2</h2>
              <p>p</p>
            </ion-label>
            <ion-note>note</ion-note>
          </ion-item>
          <ion-item-options>
            <ion-item-option>Favorite</ion-item-option>
            <ion-item-option color="danger">Delete</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
        <ion-item>bbb</ion-item>
        <ion-item>
          <ion-input type="text"></ion-input>
        </ion-item>
        <ion-footer>this is some footer text 1</ion-footer>
        <ion-footer>
          <ion-text color="danger">this is some footer text 2</ion-text>
        </ion-footer>
      </app-list1>

      <ion-list [inset]="true">
        <ion-item-sliding>
          <ion-item>aaa</ion-item>
          <ion-item-options>
            <ion-item-option>Favorite</ion-item-option>
            <ion-item-option color="danger">Delete</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
        <ion-item-sliding>
          <ion-item>bbb</ion-item>
          <ion-item-options>
            <ion-item-option>Favorite</ion-item-option>
            <ion-item-option color="danger">Delete</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
        <ion-item-sliding>
          <ion-item>ccc</ion-item>
          <ion-item-options></ion-item-options>
        </ion-item-sliding>
      </ion-list>

    </ion-content>
  `,
  styles: [``],
})
export class TestingPage { 
  option = signal('b')
}

