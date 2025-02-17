
/**
 * DEPRECATED, USE BLUR-ON-CLICK-DIRECTIVE INSTEAD!
 */

/**
 * Fixes bug of angular routerLink directive when used with ionic. In this case, the element which triggers the routing
 * remains active when the aria-hidden attribute is set to true.
 * 
 * Error shown in the console:
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


import { Directive, inject, input } from "@angular/core";
import { Router } from "@angular/router";

@Directive({
  selector: '[appRouterLink]',
  standalone: true,
  host: { 
    '(click)': 'navigateTo(url())' 
  }
})
export class RouterLinkDirective {
  private router = inject(Router)
  readonly url = input.required<string>({ alias: 'appRouterLink' })

  navigateTo(url: string) {
    const activeEl = document.activeElement as HTMLElement
    activeEl.blur()
    this.router.navigateByUrl(this.url())
  } 
}