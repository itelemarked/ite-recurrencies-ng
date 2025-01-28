import { Component, inject } from '@angular/core';

import { Recurrency } from '../types/Recurrency';
import { RecurrencyService } from '../services/recurrency.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RecurrencyListItemComponent } from './recurrency-list-item.component';


@Component({
  selector: 'app-recurrency-list',
  standalone: true,
  imports: [
    CommonModule,
    RecurrencyListItemComponent,
  ],
  template: `
    <ng-container *ngFor="let recurrency of recurrencies">
      <app-recurrency-list-item
        [recurrency]="recurrency"
      />
    </ng-container>
  `,
  styles: ``,
})
export class RecurrencyListComponent {

  // DEPENDENCIES
  recurrencyService = inject(RecurrencyService)

  // VARS
  private destroy$ = new Subject<void>()

  recurrencies: Recurrency[] = []

  constructor() {
    this.recurrencyService.recurrencies$$.pipe(takeUntil(this.destroy$)).subscribe(recs => this.recurrencies = recs)
  }

  ngOnDestroy() {
    this.destroy$.next()
  }
}