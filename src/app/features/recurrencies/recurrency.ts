import { inject, Injectable } from '@angular/core';
import { StoreCollection } from '@core/types/store';
import { AuthService } from '@core/firebase/auth';
import { createFirestoreCollection } from '@core/firebase/firestore-collection';
import { isValidRecurrency, Recurrency } from './recurrency.model';

@Injectable({
  providedIn: 'root'
})
export class RecurrencyService implements StoreCollection<Recurrency> {
  private readonly auth = inject(AuthService);

  private readonly collection = createFirestoreCollection<Recurrency>(
    () => {
      const user = this.auth.user();
      return user ? `users/${user.uid}/recurrencies` : null;
    },
    isValidRecurrency
  );

  readonly items = this.collection.items;
  readonly loading = this.collection.loading;
  readonly error = this.collection.error;

  getList = () => this.collection.getList();
  addItem = (item: Recurrency) => this.collection.addItem(item);
  updateItem = (id: string, changes: Partial<Recurrency>) => this.collection.updateItem(id, changes);
  deleteItem = (id: string) => this.collection.deleteItem(id);
}
