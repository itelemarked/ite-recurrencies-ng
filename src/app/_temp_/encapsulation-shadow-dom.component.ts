import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-encapsulation-shadow-dom',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [],
  template: `
    <p>EncapsulationShadowDomComponent works</p>
    <ng-content />
  `,
  styles: `
    .app-message {
      color: green;
    }
  `,
})
export class EncapsulationShadowDomComponent {}