import { Injectable, inject, computed } from '@angular/core';
import { DataStore } from '@core/data-store';
import { StoreCollection } from '@core/data-types';
import { Recurrency } from './recurrency.types';
import {
  isValidRecurrencyData,
  toPartialRecurrencyData,
  toRecurrency,
  toRecurrencyData,
} from './recurrency.model';

@Injectable({ providedIn: 'root' })
export class RecurrencyService implements StoreCollection<Recurrency> {
  private readonly store = inject(DataStore);
  private readonly collection = this.store.collection('recurrencies', isValidRecurrencyData);

  readonly items = computed(() => this.collection.items().map(toRecurrency));
  readonly isLoading = this.collection.isLoading;
  readonly error = this.collection.error;

  addItem(item: Omit<Recurrency, 'id'>): void {
    this.collection.addItem(toRecurrencyData(item));
  }

  updateItem(id: string, changes: Partial<Omit<Recurrency, 'id'>>): void {
    this.collection.updateItem(id, toPartialRecurrencyData(changes));
  }

  deleteItem(id: string): void {
    this.collection.deleteItem(id);
  }
}
