import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-encapsulation-emulated',
  standalone: true,
  encapsulation: ViewEncapsulation.Emulated,
  imports: [],
  template: `
    <p>EncapsulationEmulatedComponent works</p>
    <ng-content />
  `,
  styles: `
    :host::ng-deep .app-message {
      color: blue;
    }
  `,
})
export class EncapsulationEmulatedComponent {}