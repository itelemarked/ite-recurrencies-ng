import { Component } from '@angular/core';
import { HelloComponent } from './hello.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HelloComponent],
  template: `
    <app-hello
      [name]="name"
    ></app-hello>
  `,
  styles: ``
})
export class AppComponent {

  name = 'bob'

}

