/**
 * Use instead of ion-skeleton-text
 * 
 * Reason: 
 * it hide children and content, and preserve sizing of the host element.
 */


import { Directive, ElementRef, inject, Renderer2 } from "@angular/core";

@Directive({
  selector: '[appSkeleton]',
  standalone: true,
  // styles: `
  //   @keyframes pulse {
  //     0% { opacity: 0.6 }
  //     50% { opacity: 1 }
  //     100% { opacity: 0.6 }
  //   }

  //   .skeleton {
  //     color: transparent;
  //     background-color: var(--ion-color-step-200);
  //     border-radius: 6px;
  //     animation-name: pulse;
  //     animation-duration: 1.2s;
  //     animation-iteration-count: infinite;
  //     animation-timing-function: linear;
  //   }

  //   .skeleton * {
  //     visibility: hidden;
  //   }
  // `,
  
})
export class SkeletonDirective {
  private elementRef = inject(ElementRef)
  private renderer = inject(Renderer2)
  
  ngOnInit() {
    const host = this.elementRef.nativeElement as Element
    const children = Array.from(host.children as HTMLCollection)
    
    children.forEach(child => this.renderer.setStyle(child, 'visibility', 'hidden'))

    this.renderer.setStyle(host, 'color', 'transparent')
    this.renderer.setStyle(host, 'background-color', 'var(--ion-color-step-200)')
    // this.renderer.setStyle(host, 'border-radius', '6px')

    host.animate([
      { opacity: 0.6, offset: 0},
      { opacity: 1, offset: 0.5},
      { opacity: 0.6, offset: 1}
    ], {
      duration: 1200,
      iterations: Infinity
    })
  }
}