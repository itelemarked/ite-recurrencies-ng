import { inject, Injectable } from '@angular/core';
import { createFirestoreCollection } from '../../core/firebase-adapter/firestore-collection';
import { isValidRecurrency, Recurrency } from './recurrency.model';
import { StoreCollection } from '@core/data-types';
import { AuthStore } from '@core/auth-store';

@Injectable({
  providedIn: 'root'
})
export class RecurrencyService implements StoreCollection<Recurrency> {
  private readonly auth = inject(AuthStore);

  private readonly collection = createFirestoreCollection<Recurrency>(
    () => {
      const user = this.auth.user();
      return user ? `users/${user.uid}/recurrencies` : null;
    },
    isValidRecurrency
  );

  readonly items = this.collection.items;
  readonly isLoading = this.collection.isLoading;
  readonly error = this.collection.error;

  getList = () => this.collection.items;
  addItem = (item: Recurrency) => this.collection.addItem(item);
  updateItem = (id: string, changes: Partial<Recurrency>) => this.collection.updateItem(id, changes);
  deleteItem = (id: string) => this.collection.deleteItem(id);
}
