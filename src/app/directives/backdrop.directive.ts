import { Directive, ElementRef, inject, Renderer2 } from "@angular/core";
import { IonLoading } from "@ionic/angular/standalone";

@Directive({
  selector: '[appBackdrop]',
  standalone: true,
})
export class BackdropDirective {
  elRef = inject(ElementRef)
  renderer = inject(Renderer2)

  constructor() {
    console.log('BackdropDirective')
    const div = this.renderer.createElement('div')
    this.renderer.addClass(div, 'app-backdrop')
    this.renderer.setStyle(div, 'z-index', '3')
    this.renderer.setStyle(div, 'position', 'absolute')
    this.renderer.setStyle(div, 'top', '0')
    this.renderer.setStyle(div, 'height', '100%')
    this.renderer.setStyle(div, 'width', '100%')
  
    this.renderer.appendChild(this.elRef.nativeElement, div)
  }
}