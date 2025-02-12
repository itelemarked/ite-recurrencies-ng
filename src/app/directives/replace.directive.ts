import { Directive, ElementRef, inject, Renderer2 } from "@angular/core";


@Directive({
  selector: '[replace]',
  standalone: true,
})
export class ReplaceDirective {
  private elementRef = inject(ElementRef)
  private renderer = inject(Renderer2)
  
  ngOnInit() {
    const host = this.elementRef.nativeElement as Element
    const parent = this.renderer.parentNode(host)
    const firstChild = this.elementRef.nativeElement.firstChild as Element
    const className = host.nodeName.toLowerCase() + '-replaced'
    
    this.renderer.addClass(firstChild, className)
    this.renderer.insertBefore(parent, firstChild, host)
    this.renderer.removeChild(parent, host)
  }
}