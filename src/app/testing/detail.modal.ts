import { Component, computed, Input, input, signal } from "@angular/core";

@Component({
  selector: 'app-detail-modal',
  standalone: true,
  imports: [],
  template: `
    DetailModalComponent works!
    <p>value: {{ val() }}</p>
  `,
  styles: [``]
})
export class DetailModalComponent {
  // DEPENDENCIES

  // STATE
  value = input.required<string>()
  // @Input({required: true}) value!: string
  

  // SELECTORS
  val = computed(() => this.value())

  // ACTIONS

  // PRIVATE

}