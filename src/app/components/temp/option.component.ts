import { CommonModule } from '@angular/common';
import { Component, computed, input, Signal } from '@angular/core';



@Component({
  selector: 'app-option',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <div class="flex" (click)="onSelect(value())">
      <div class="flex-1">{{ label() }}</div>
      <div class="flex-none">{{ selected() }}</div>
    </div>
  `,
  styles: `

  `,
})

export class OptionComponent {
  label = input('')
  value = input.required()
  selected!: Signal<boolean>
  onSelect!: (val: any) => void
}