import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-hello',
  standalone: true,
  imports: [],
  template: `
    <div>Hello {{ name() }}!</div>
  `,
  styles: ``,
})
export class HelloComponent {

  name = input<string | undefined>()

  constructor() {}

}