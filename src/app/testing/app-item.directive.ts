import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import { Color } from '@ionic/core';

/**
 * appItem Directive
 * An enhancement for the ion-item component.
 * 
 * PROPS:
 * - textColor: string | null.      The color will only be set if it is matching the ionic colors ('primary', 'secondary', etc...).
 *                                  Otherwise (including null or undefined) it will default to the inherited original ion-item color.
 */

@Directive({
  selector: 'ion-item[appItem]',
})
export class ItemDirective {
  // DEPENDENCIES
  private hostEl = inject(ElementRef);

  // STATE
  textColor = input<string | null | undefined>();

  constructor() {
    effect(() => {
      this.hostEl.nativeElement.style.color = `var(--ion-color-${this.textColor()})`;
    });
  }
}
