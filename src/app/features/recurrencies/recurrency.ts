import { computed, inject, Injectable } from "@angular/core";
import { StoreCollection } from "@core/data-types";
import { isValidRecurrency, Recurrency } from "./recurrency.model";
import { AuthStore } from "@core/auth-store";
import { DataStore } from "@core/data-store";

@Injectable({
  providedIn: 'root',
})
export class RecurrencyService implements StoreCollection<Recurrency> {
  private readonly auth = inject(AuthStore);
  private readonly store = inject(DataStore);

  private readonly collection = this.store.collection<Recurrency>(
    () => {
      const user = this.auth.user();
      return user ? `users/${user.uid}/recurrencies` : null;
    },
    isValidRecurrency,
  );

  readonly items = this.collection.items;
  readonly isLoading = computed(() => this.auth.isLoading() || this.collection.isLoading());
  readonly error = this.collection.error;
  readonly addItem = this.collection.addItem;
  readonly updateItem = this.collection.updateItem;
  readonly deleteItem = this.collection.deleteItem;
}
