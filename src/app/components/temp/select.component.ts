import { CommonModule } from '@angular/common';
import { Component, computed, contentChildren, input, output } from '@angular/core';
import { OptionComponent } from './option.component';



@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <div>
      <ng-content />
    </div>
  `,
  styles: `

  `,
})

export class SelectComponent {
  value = input.required()
  private selectOptions = contentChildren(OptionComponent)
  valueChange = output<any>()

  ngAfterContentInit() {
    this.selectOptions().forEach(opt => {
      opt.selected = computed(() => opt.value() === this.value())
      opt.onSelect = (val: any) => this.valueChange.emit(val)
    })
  }
}