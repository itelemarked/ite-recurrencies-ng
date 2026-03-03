import { Component, computed, input, linkedSignal, output } from "@angular/core";
import { IonicModule } from '@ionic/angular';
import { Todo } from "../../todo-model";

type TodoFormOutput = {
  uid?: string,
  title?: string,
  completed: boolean
}

@Component({
  selector: 'app-todo-edit-form',
  imports: [
    IonicModule
  ],
  template: `
    <ion-list [inset]="true">
      <ion-item [style.--color]="!isValidTitle() && showErrors() ? 'var(--ion-color-danger)' : 'var(--ion-color-primary)'">
        <ion-input 
          type="text" 
          placeholder="Enter a todo title"
          [value]="title()" 
          (ionInput)="onTitleChange($event.detail.value!)"
        />
      </ion-item>
    </ion-list>
    @if(!isValidTitle() && showErrors()) {
      <ion-text class="mx-xl text-sm" color="danger">A title is required</ion-text>
    }
    <ion-list [inset]="true">
      <ion-item>
        <ion-toggle
          [checked]="completed()"
          (ionChange)="onCompletedChange($event.detail.checked)"
        >
          <ion-label>completed</ion-label>
        </ion-toggle>
      </ion-item>
    </ion-list>
  `,
  styles: [``]
})
export class TodoEditForm {
  // DEPENDENCIES

  // STATE
  todoInput = input.required<Todo | null>({alias: 'todo'})
  showErrorsInput = input.required<boolean>({alias: 'showErrors'})
  todoChangeOutput = output<TodoFormOutput>({alias: 'todoChange'})

  private state = {
    // todo: linkedSignal<TodoFormOutput>(() => {
    //   const todoInput = this.todoInput()
    //   return todoInput === null ? {uid: undefined, title: undefined, completed: false} : todoInput
    // }),
    todo: linkedSignal<TodoFormOutput>(() => this.todoInput() ?? {uid: undefined, title: undefined, completed: false}),
  } 

  // SELECTORS
  protected title = computed(() => this.state.todo().title ?? '')
  protected isValidTitle = computed(() => {
    const titleValue = this.state.todo().title
    return titleValue !== undefined && titleValue.trim() !== ''
  })
  protected completed = computed(() => this.state.todo().completed)
  
  protected showErrors = computed(() => this.showErrorsInput())

  // ACTIONS
  protected onTitleChange = (value: string) => {
    value.trim() === '' ? this.state.todo.update(t => ({...t, title: undefined})) : this.state.todo.update(t => ({...t, title: value}))
    this.todoChangeOutput.emit(this.state.todo())
  }

  protected onCompletedChange = (completed: boolean) => {
    this.state.todo.update(t => ({...t, completed}))
    this.todoChangeOutput.emit(this.state.todo())
  }

  // PRIVATE

}