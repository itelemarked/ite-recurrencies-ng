
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecurrencyService } from '../../../../services/recurrency.service';


@Component({
  selector: 'app-recurrency-service-check',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
    <div>recurrencies are loading: {{ recurrencyService.isLoading() }}</div>
    <div class="item flex" *ngFor="let recurrency of recurrencyService.recurrencies()">
      <div class="flex-1">title: {{ recurrency.title }}</div>
      <button (click)="onDelete(recurrency.id!)">delete</button>
    </div>
  `,
  styles: `
    :host {
      display: block;
      margin: 10px 0;
    }

    .item {
      margin: 5px;
      padding: 10px;
      border: 1px solid lightgrey;
    }
  `,
})
export class RecurrencyServiceCheckComponent {

  recurrencyService = inject(RecurrencyService)

  onDelete(id: string) {
    this.recurrencyService.delete(id)
  }

}