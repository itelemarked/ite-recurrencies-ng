import { effect, inject, Injectable, signal } from '@angular/core';
import { FirebaseService } from '../firebase-service';
import { AuthService } from './auth-service';
import { DATE_FORMAT } from '../../../js/timezone-date/types/DateFormat';
import { map, Observable, startWith, switchMap, tap } from 'rxjs';
import { isSettings, Settings } from '../../recurrencies/types/Settings';
import { doc, onSnapshot } from 'firebase/firestore';
import { User } from '../../recurrencies/types/User';
import { TIMEZONE } from '../../../js/timezone-date/types/Timezone';




@Injectable({ providedIn: 'root' })
export class SettingsService {
  private firestore = inject(FirebaseService).firestore
  private authService = inject(AuthService)

  private DEFAULT_SETTINGS: Settings = {
    timezone: TIMEZONE.ZURICH,
    dateFormat: DATE_FORMAT.CH_DATE
  }
  
  dataForUser$ = (user: User | null | undefined) => new Observable<unknown>((subscriber) => {
    if(user === null || user === undefined) {
      subscriber.next(this.DEFAULT_SETTINGS)
    } else {
      const docRef = doc(this.firestore, `users/${user.uid}/settings/SETTINGS_UID`)
      const unsubscribe = onSnapshot(docRef, (settingsData) => {
        subscriber.next(settingsData.data())
      })
      subscriber.add(() => unsubscribe())
    }
  })

  toSettings = (firestoreSettings: unknown): Settings => isSettings(firestoreSettings) ? firestoreSettings : this.DEFAULT_SETTINGS

  settings$ = this.authService.user$.pipe(
    switchMap(this.dataForUser$),
    map(this.toSettings)
  )

}