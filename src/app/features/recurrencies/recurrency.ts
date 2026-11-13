import { inject, Injectable } from '@angular/core';
import { DataStore } from '@core/data-store';
import { StoreCollection } from '@core/data-types';
import { isValidRecurrency, Recurrency } from './recurrency.model';

@Injectable({
  providedIn: 'root',
})
export class RecurrencyService implements StoreCollection<Recurrency> {
  private readonly store = inject(DataStore);
  private readonly collection = this.store.collection('recurrencies', isValidRecurrency);

  readonly items = this.collection.items;
  readonly isLoading = this.collection.isLoading;
  readonly error = this.collection.error;

  readonly addItem = this.collection.addItem;
  readonly updateItem = this.collection.updateItem;
  readonly deleteItem = this.collection.deleteItem;
}
