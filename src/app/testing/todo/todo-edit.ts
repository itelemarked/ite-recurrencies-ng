import { Component, input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Todo } from './todo.model';

@Component({
  selector: 'app-todo-edit',
  standalone: true,
  imports: [IonicModule],
  template: `
    <ion-list [inset]="true">
      <ion-item>
        <ion-input type="text" [value]="todo().title" />
      </ion-item>
      <ion-item>
        <ion-checkbox [checked]="todo().completed" />
      </ion-item>
    </ion-list>
  `,
  styles: [``],
})
export class TodoEdit {
  todo = input.required<Todo>();
}
