import { Component } from '@angular/core';
import { AppInputComponent } from '../app-input.component';


@Component({
  selector: 'auth-authenticate-form',
  standalone: true,
  imports: [
    AppInputComponent
  ],
  template: `

    <app-input
      label="Email"
      placeholder="Enter an email"
      type="text"
    />

    <app-input
      label="Password"
      placeholder="Enter a password"
      type="password"
    />

  `,
})

export class AuthAuthenticateFormComponent {


  constructor() {
    const a = {
      x: 99,
      y: () => a.x + 1
    }

    console.log(a.y())
  }

}