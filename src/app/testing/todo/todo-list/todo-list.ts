import { Component, computed, inject, input, output, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Todo } from '../todo-model';
import { TodoService } from '../todo-service';

@Component({
  selector: 'app-todo-list',
  imports: [IonicModule],
  template: `
    <ion-list [inset]="true">
      @for (todo of todos(); track todo.uid) {
        <ion-item button (click)="onTodoTap(todo)">
          <ion-label>{{ todo.title }}</ion-label>
          <ion-note>completed: {{ todo.completed }}</ion-note>
        </ion-item>
      }
    </ion-list>
  `,
  styles: [``],
})
export class TodoList {
  // DEPENDENCIES

  // STATE
  todosInput = input<Todo[]>([], {alias: 'todos'})
  selectOutput = output<Todo>({alias: 'select'})

  // SELECTORS
  protected todos = computed(() => this.todosInput())

  // ACTIONS
  protected onTodoTap = (todo: Todo) => {
    this.selectOutput.emit({...todo})
  }
}
