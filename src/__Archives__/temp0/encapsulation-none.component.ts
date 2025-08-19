import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-encapsulation-none',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [],
  template: `
    <p>EncapsulationNoneComponent works</p>
    <ng-content />
  `,
  styles: ``,
})
export class EncapsulationNoneComponent {}