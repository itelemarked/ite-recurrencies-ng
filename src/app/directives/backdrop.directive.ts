/**
 * Fixes ionic bug.
 * Supported for ION-ALERT component only.
 * 
 * Without appBackdrop: when clicking on ion-backdrop, an "aria-hidden: true" error is fired and 
 * the following error is logged to the console: 
 *   Blocked aria-hidden on an element because its descendant retained focus. 
 *   The focus must not be hidden from assistive technology users. 
 *   Avoid using aria-hidden on a focused element or its ancestor. 
 *   Consider using the inert attribute instead, which will also prevent focus. 
 *   For more details, see the aria-hidden section of the WAI-ARIA specification at https://w3c.github.io/aria/#aria-hidden.
 *   Element with focus: ion-backdrop
 *   Ancestor with aria-hidden:  <ion-backdrop class=​"sc-ion-alert-ios ios backdrop-no-tappable" tabindex=​"-1" aria-hidden=​"true" style>​…​</ion-backdrop>​
 * 
 * Workaround: create a custom backdrop with a higher index as the ion-backdrop in order to prevent the click listener to be fired on the ion-backdrop element.
 */





// TODO: implementation for extending for other than ion-alert? --> create interfaces and implementations for composition?

import { Directive, ElementRef, inject, Renderer2 } from "@angular/core";
import { IonAlert } from "@ionic/angular";

// ADD SUPPORTED PARENT TYPES HERE...
type SupportedParent = IonAlert

@Directive({
  // ADD SUPPORTED PARENT ELEMENT NAMES HERE...
  selector: 'ion-alert[appBackdrop]',
  standalone: true,
})
export class BackdropDirective {

  private elementRef = inject(ElementRef)
  private renderer = inject(Renderer2)

  constructor() {
    const backdrop = this.createdBackdropElement()
    this.renderer.appendChild(this.elementRef.nativeElement, backdrop)
  }

  private createdBackdropElement() {
    const div = this.renderer.createElement('div')
    this.renderer.addClass(div, 'app-backdrop')
    this.renderer.setStyle(div, 'position', 'absolute')
    this.renderer.setStyle(div, 'height', '100%')
    this.renderer.setStyle(div, 'width', '100%')
    this.renderer.setStyle(div, 'z-index', '3')
    this.renderer.setStyle(div, 'top', '0')
    this.renderer.listen(div, 'click', this.onBackdropClick.bind(this))
    return div
  }

  private onBackdropClick() {
    const parent: SupportedParent = this.elementRef.nativeElement
    const canDismiss = parent.backdropDismiss
    if (canDismiss) {
      parent.dismiss()
    }
  }

}

