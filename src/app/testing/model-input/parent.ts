import { Component, computed, model, signal } from "@angular/core";
import { IonicModule } from '@ionic/angular';
import { Child } from "./child";

@Component({
  selector: 'app-parent',
  imports: [
    IonicModule,
    Child
  ],
  template: `
    <app-child
      [(value)]="value"
    />
    <p>
      value from parent: {{ value() }}
    </p>
  `,
  styles: [``]
})
export class Parent {
  // DEPENDENCIES

  // STATE
  value = signal<string>('')

  // SELECTORS

  // ACTIONS

  // PRIVATE

}