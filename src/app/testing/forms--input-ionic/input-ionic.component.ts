import { Component, contentChild, contentChildren, input, Signal } from '@angular/core';
import { IonButton, IonIcon, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-input-ionic',
  standalone: true,
  imports: [IonButton, IonIcon, IonInput],
  template: `
      <!-- <ion-input
        label="Email"
        label-placement="stacked"
        fill="outline"
        mode="md"
        placeholder="Enter email"
      /> -->
      <ng-content></ng-content>
  `,
  styles: `
    :host {
      /*Component CSS variables (maybe overwritten)*/
      
    }
  `,
})
export class InputIonicComponent {

  // content = contentChild(IonInput)
  ionInputEls = contentChildren(IonInput)

  constructor() {}
  
  ngOnInit() {
    // const content = this.content()
    // if (content === undefined) {
    //   console.warn('InputIonicComponent must have a child of type IonInput...')
    // }
    const els = this.ionInputEls()
    // if (this.isUnique<>(els)) console.warn ('not unique...')
  }

  // UTILS
  isUnique<T>(items: T[]): boolean {
    return items.length === 1 ? true : false
  }

}
