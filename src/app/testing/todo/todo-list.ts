import { Component, input, output, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Todo } from './todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [IonicModule],
  template: `
    <ion-list [inset]="true">
      @for (todo of todos(); track todo.uid) {
        <ion-item button (click)="select.emit(todo)">
          <ion-label>{{ todo.title }}</ion-label>
          <ion-note>completed: {{ todo.completed }}</ion-note>
        </ion-item>
      }
    </ion-list>
  `,
  styles: [``],
})
export class TodoList {
  todos = input<Todo[]>([])
  select = output<Todo>()
}
