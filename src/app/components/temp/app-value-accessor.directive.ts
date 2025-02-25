import { computed, Directive, effect, forwardRef, model, signal } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";


/**
 * Separate of concerns for the ControlAccessorValue implementation.
 * If implemented in the custom controls, it can be messy with this bizarre structure...
 * 
 * It renders only the public properties:
 *   - getValue: Signal<T>            gets the value property of the parent FormControl
 *   - getDisabled: Signal<boolean>   gets the disabled property of the parent FormControl
 *   - emitValue: (val: T) => void    emits the changed value to the parent FormControl and updates it. Moreover, add class 'ng-dirty' to the parent FormControl
 *   - markAsTouched: () => void      Adds class 'ng-touched' to the parent FormControl.
 * 
 * How to use:
 *   - in the component which should implement this custom value accessor, adds this directive to the hostDirective option:
 *     (...) hostDirectives: [AppValueAccessorDirective] (...)
 *   - inject this directive with the generic type in your component:
 *     (...) valueAccessor = inject<AppValueAccessorDirective<string>>(AppValueAccessorDirective)
 *   - get the value of the custom value accessor where needed
 *   - get the 'disabled' property of the custom value accessor where needed
 *   - output the emitted value of the custom value accessor where needed
 *   - mark the control as 'ng-touched' where needed
 * 
 *   E.g of use:
 *   <input
 *    type="text"
 *    [value]="valueAccessor.getValue()"
 *    [disabled]="valueAccessor.getValue()"
 *    (input)="valueAccessor.emitValue($event.target.value)"       <-- $event.target.value not working here... you should use a component method instead (just for viewing the idea here...)
 *    (blur)="valueAccessor.markAsTouched()"
 *  />
 *     
 *     
 */



@Directive({
  selector: '[appValueAccessor]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppValueAccessorDirective),
      multi: true,
    }
  ]
})
export class AppValueAccessorDirective<T> {

  private _getValue = signal<T | undefined>(undefined)
  /* FormControl --> View */
  public getValue = computed(() => this._getValue())

  private _getDisabled = signal<boolean | undefined>(undefined)
  /* FormControl --> View */
  public getDisabled = computed(() => this._getDisabled())

  /* Function which serves two purposes (under the hood): a) emits a new value on change and b) marks the component with the 'ng-dirty' class.
   * View --> FormControl
   */
  public emitValue: (val: T) => void = (val: T) => {}

  /* it marks the control with the ng-touched class
   * View --> FormControl
   */
  public markAsTouched: () => void = () => {}

  /* called when FormControl 'value' changes. FormControl --> View */
  protected writeValue(val: T): void {
    this._getValue.set(val)
  }

  /* called when FormControl 'disabled' changes. FormControl --> View */
  protected setDisabledState(val: boolean): void {
    this._getDisabled.set(val)
  }

  /* sets property function */
  protected registerOnTouched(fn: () => void): void {
    this.markAsTouched = fn
  }
  
  /* sets property function */
  protected registerOnChange(fn: (val: T) => void): void {
    this.emitValue = fn
  }

}