import { Component, signal } from "@angular/core";
import { IonicModule } from '@ionic/angular';
import { Title1 } from "./title1";

@Component({
  selector: 'app-two-way-binding-page',
  imports: [
    IonicModule,
    Title1
],
  template: `
    <app-title1
        [title]="title1()"
        (titleChange)="title1.set($event)"
    />
    <!-- <app-title1
        [(title)]="title1"
    /> -->

    <p>title1 from parent: {{ title1() }}</p>
  `,
  styles: [``]
})
export class TwoWayBindingPage {

  title1 = signal('title1')
  
  // DEPENDENCIES

  // STATE

  // SELECTORS

  // ACTIONS

  // PRIVATE

}