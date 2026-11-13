import { inject, Injectable } from '@angular/core';
import { DataStore } from '@core/data-store';
import { StoreDocument } from '@core/data-types';
import { isValidSettings, Settings } from './settings.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService implements StoreDocument<Settings> {
  private readonly store = inject(DataStore);
  private readonly document = this.store.document('settings', isValidSettings);

  readonly item = this.document.item;
  readonly isLoading = this.document.isLoading;
  readonly error = this.document.error;

  readonly setDoc = this.document.setDoc;
  readonly updateDoc = this.document.updateDoc;
  readonly deleteDoc = this.document.deleteDoc;
}
