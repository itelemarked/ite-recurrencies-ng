import { Component, computed, input, linkedSignal, model, output } from "@angular/core";
import { IonicModule } from '@ionic/angular';
import { Todo } from "../../todo-model";

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
  showErrorsInput = input.required<boolean>({alias: 'showErrors'})
  todoInput = model.required<Todo | null>({alias: 'todo'})
  // todoChangeOutput = output<Todo | null>({alias: 'todoChange'})

  private state = {
    // todo: linkedSignal<Todo | null>(() => this.todoInput()),
    uid: linkedSignal<string | undefined>(() => this.todoInput()?.uid),
    title: linkedSignal<string>(() => this.todoInput()?.title ?? ''),
    completed: linkedSignal<boolean>(() => this.todoInput()?.completed ?? false)
  } 

  // SELECTORS
  protected title = computed(() => this.state.title())
  protected isValidTitle = computed(() => this.state.title().trim() !== '')
  protected completed = computed(() => this.state.completed())
  protected showErrors = computed(() => this.showErrorsInput())
  private todo = computed<Todo | null>(() => {
    if(this.isValidTitle()) {
      return {
        uid: this.state.uid(),
        title: this.state.title(),
        completed: this.state.completed()
      }
    }
    return null
  })

  // ACTIONS
  protected onTitleChange = (val: string) => {
    this.state.title.set(val)
    this.todoInput.set(this.todo())
  }

  protected onCompletedChange = (val: boolean) => {
    this.state.completed.set(val)
    this.todoInput.set(this.todo())
  }

  // PRIVATE

}