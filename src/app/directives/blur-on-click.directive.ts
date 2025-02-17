/**
 * Fixes ionic bug. 
 * 
 * Without appBlurOnClick: when navigating, an "aria-hidden: true" error is fired and 
 * the following error is logged to the console: 
 *    "Blocked aria-hidden on an element because its descendant retained focus. 
 *    The focus must not be hidden from assistive technology users. 
 *    Avoid using aria-hidden on a focused element or its ancestor. 
 *    Consider using the inert attribute instead, which will also prevent focus. For more details,
 *    see the aria-hidden section of the WAI-ARIA specification at https://w3c.github.io/aria/#aria-hidden.
 *    Element with focus: button
 *    Ancestor with aria-hidden: 
 *    (...)"
 * 
 * Workaround: deactivate the active element (blur()) before navigating.
 */

import { Directive } from "@angular/core";

@Directive({
  selector: '[appBlurOnClick]',
  standalone: true,
  host: { 
    '(click)': 'onHostClick()' 
  }
})
export class BlurOnClickDirective {

  onHostClick = () => blurActiveElement()

}

export function blurActiveElement() {
  const activeEl = document.activeElement as HTMLElement
  activeEl.blur()
}