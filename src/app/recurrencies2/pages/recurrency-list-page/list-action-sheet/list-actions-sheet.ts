import { Component, input, output } from "@angular/core";
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'app-list-action-sheet',
  standalone: true,
  imports: [
    IonicModule
  ],
  template: `
    <ion-action-sheet
      [isOpen]="isOpenInput()"
      [buttons]="buttons"
    />
  `,
  styles: [``]
})
export class ListActionSheet {
  // DEPENDENCIES

  // STATE
  isOpenInput = input<boolean>(false, {alias: 'isOpen'})
  addOutput = output<void>({alias: 'add'})
  filterByOutput = output<'title' | 'expiry'>({alias: 'filterBy'})
  cancelOutput = output<void>({alias: 'cancel'})

  // SELECTORS
  buttons = [
    {
      text: 'Add Item',
      handler: () => this.addOutput.emit(),
    },
    {
      text: 'Filter by "Title"',
      handler: () => this.filterByOutput.emit('title'),
    },
    {
      text: 'Filter by "Expiry"',
      handler: () => this.filterByOutput.emit('expiry'),
    },
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => this.cancelOutput.emit(),
    },
  ]

  // ACTIONS

  // PRIVATE

}