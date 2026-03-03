import { computed, Injectable, signal } from "@angular/core";
import { Todo } from "./todo-model";

@Injectable({providedIn: 'root'})
export class TodoService {

  private state = {
    todos: signal<Todo[]>([
      {uid: 'abjklsaj', title: 'Walk the dog', completed: false},
      {uid: 'hiwjehfd', title: 'Make dinner', completed: true}
    ])
  }

  todos = computed(() => {
    return this.state.todos()
  })

  update = (todo: Todo) => {
    const newTodos = this.state.todos().map(t => t.uid === todo.uid ? todo : t)
    this.state.todos.set(newTodos)
  }

}