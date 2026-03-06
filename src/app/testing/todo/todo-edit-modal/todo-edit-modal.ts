import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Todo } from '../todo-model';

@Component({
  selector: 'app-todo-edit-modal',
  imports: [
    IonicModule
  ],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="onOk()">Ok</ion-button>
        </ion-buttons>
        <ion-title>Todo Edit</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="onCancel()">Cancel</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      
      <!-- <app-todo-edit-form
        [todo]="todo()"
        [showErrors]="showErrors()"
        (todoChange)="onFormChange($event)"
      /> -->

    </ion-content>
  `,
  styles: [``],
})
export class TodoEditModal {
  // DEPENDENCIES
  private modalCtl = inject(ModalController);

  // STATE
  todoInput = input.required<Todo | null>({alias: 'todo'})

  private state = {
    todo: linkedSignal<Partial<Todo>>(() => this.todoInput() ?? {uid: undefined, title: undefined, completed: false}),
    showFormErrors: signal<boolean>(false)
  }

  // SELECTORS
  protected todo = computed(() => this.state.todo())
  protected showErrors = computed(() => this.state.showFormErrors())
  private isValidTodo = computed(() => {
    const currentTodo = this.state.todo()
    return currentTodo !== null 
      && currentTodo.title !== undefined 
      && currentTodo.title.trim() !== ''
  })

  // ACTIONS
  protected onOk = () => {
    if(this.isValidTodo()) {
      this.modalCtl.dismiss(this.state.todo())
    }
    else {
      this.state.showFormErrors.set(true)
    }
  };

  protected onCancel = () => {
    this.modalCtl.dismiss(null);
  };

  protected onFormChange = (e: Partial<Todo>) => {
    // this.state.title.set(e.title)
    // this.state.completed.set(e.completed)
  }

  // PRIVATE
}
