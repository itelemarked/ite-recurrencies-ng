import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { chevronBackOutline, closeCircleOutline } from 'ionicons/icons';
import { IonicModule } from '@ionic/angular';
import { TodoList } from './todo/todo-list';
import { Todo } from './todo/todo.model';
import { TodoEdit } from './todo/todo-edit';
import { PersonForm } from './forms/person-form';
import { PersonForm2 } from './forms/person-form2';
import { PeriodForm } from './period-form/period-form';

@Component({
  selector: 'app-testing-page',
  imports: [FormsModule, IonicModule, TodoList, TodoEdit, PersonForm, PersonForm2, PeriodForm],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="onBackButtonClick()">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Testing</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="onCancelClick()"> Cancel </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">

      <app-period-form
        [periodNb]="2"
      />

    </ion-content>
  `,
  styles: [``],
})
export class TestingPage {

  constructor() {
    addIcons({ chevronBackOutline, closeCircleOutline });
  }

  onBackButtonClick() {}

  onCancelClick() {}
}
