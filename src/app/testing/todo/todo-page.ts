import { Component, computed, inject, signal } from "@angular/core";
import { IonicModule, ModalController } from '@ionic/angular';
import { TodoList } from "./todo-list/todo-list";
import { TodoService } from "./todo-service";
import { Todo } from "./todo-model";
import { TodoEditModal } from "./todo-edit-modal/todo-edit-modal";
import { TodoEditForm } from "./todo-edit-modal/todo-edit-form/todo-edit-form";

@Component({
  selector: 'app-todo-page',
  imports: [
    IonicModule,
    TodoList,

    TodoEditForm
  ],
  template: `
    <!-- <app-todo-list
      [todos]="todos()"
      (select)="onEditOrCreateTodo($event)"
    />
    <ion-button (click)="onEditOrCreateTodo(null)">Add Todo</ion-button> -->

    <app-todo-edit-form
      [(todo)]="firstTodo"
      [showErrors]="showErrors()"
    />

    <ion-button size="small" (click)="showErrors.set(true)">show errors</ion-button>

    @if(firstTodo() === null) {
      <div>
        firstTodo: null
      </div>
    }
    @else {
      <div>
        uid: {{ firstTodo()!.uid}} <br>
        title: {{ firstTodo()!.title }} <br>
        completed: {{ firstTodo()!.completed}}
      </div>
    }
  `,
  styles: [``]
})
export class TodoPage {
    // DEPENDENCIES
  private todoService = inject(TodoService)
  private modalCtl = inject(ModalController)

  // STATE

  // SELECTORS
  protected todos = computed(() => this.todoService.todos())

  // ACTIONS
  protected onEditOrCreateTodo = async (editOrCreate: Todo | null) => {
    // TODO: output should be Todo | null iso undefined
    const output = await this.getTodoUserInputs(editOrCreate)
    if(output === null) return
    this.todoService.update(output)
  }

  // PRIVATE
  private getTodoUserInputs = async (todo: Todo | null): Promise<Todo | null> => {
    const modal = await this.modalCtl.create({
      component: TodoEditModal,
      componentProps: {
        todo
      }
    })
    modal.present()

    const {data} = await modal.onWillDismiss()
    return data
  }


  // firstTodo = signal({
  //   uid: 'adjakl',
  //   title: 'Do something',
  //   completed: true
  // })

  firstTodo = signal<Todo | null>(null)

  onTodoChange(todo: any) {
    console.log(todo)
  }

  showErrors = signal(false)





}