import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TodoPage } from './todo/todo-page';
import { ModelInputPage } from './model-input/model-input-page';

@Component({
  selector: 'app-testing-page',
  imports: [FormsModule, IonicModule, TodoPage, ModelInputPage],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">
      
      <app-todo-page/>
       <!-- <app-model-input-page/> -->

    </ion-content>
  `,
  styles: [``],
})
export class TestingPage {}

