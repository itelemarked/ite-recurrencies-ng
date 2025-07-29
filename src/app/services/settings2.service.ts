import { inject, Injectable, Signal } from '@angular/core';
import { DateFormat, isDateFormat } from '../types/DateFormat.enum';
import {
  BehaviorSubject,
  distinctUntilChanged,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { isTimezone, Timezone } from '../types/Timezone.enum';
import { toSignal } from '@angular/core/rxjs-interop';
import { CustomTypeError } from '@app/utils/errors';
import { AuthService } from './auth.service';
import { User } from '@app/types/User.type';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Auth2Service } from './auth2.service';
import { DataRequest } from '@app/types/DataRequest.type';

type Settings = {
  timezone: Timezone;
  dateFormat: DateFormat;
};

interface SettingsServiceInterface {
  /**
   * Observable and Signal which returns:
   * - current Settings (and the DEFAULT one if no data is present on the server)
   *
   * Settings data on the server consists always of NOTHING or EVERYTHING (-> if at least one property is not the default one, all other props, also the default ones, will be saved as well!)
   * Since settings depends on the current user, a new fetch must be done when changing user, and therefore the value must be set to 'loading' during the fetch.
   */
  settings$: Observable<Settings | undefined>;
  settings: Signal<Settings | undefined>;
  /**
   * Partial settings properties or the whole settings object can be passed as argument.
   * Settings data are updated, set (if not present yet) or deleted (in case they are the same as DEFAULT) on the server.
   * Settings are set accordingly in the settingsService
   */
  save: (options: Partial<Settings>) => Promise<void>;
  /**
   * Settings data are delete on the server.
   * Settings are set to DEFAULT in the settingsService.
   */
  reset: () => Promise<void>;
}

@Injectable({ providedIn: 'root' })
export class Settings2Service {
  private authService = inject(Auth2Service);
  private fbStore = inject(AngularFirestore);

  private DEFAULT_VALUES: Settings = {
    timezone: Timezone.PLATFORM_DEFINED,
    dateFormat: DateFormat.PLATFORM_DEFINED,
  };

  /**
   * Needed to trigger changes manually (e.g: set 'loading' state by defining 'undefined')
   * 'fbSettings$' changes must also be reflected here!
   */
  private _settings$ = new BehaviorSubject<DataRequest<Settings>>({
    state: 'loading',
  });

  fbSettings$ = this.authService.user$.pipe(
    // tap(usrReq => {
    //   if(usrReq.state === 'loading') {
    //     console.log('user: loading')
    //   } else if(usrReq.state === 'data-not-found') {
    //     console.log('user: data-not-found')
    //   } else {
    //     console.log(`user: ${usrReq.value.email}`)
    //   }
    // }),
    switchMap((usrReq) => {
      if(usrReq.state === 'loading') {
        return of({state: 'loading'} as DataRequest<Settings>)
      }
      if(usrReq.state === 'data-not-found') {
        return of({state: 'data-not-found'} as DataRequest<Settings>).pipe(
          startWith({state: 'loading'} as DataRequest<Settings>),
          // tap(res => {
          //   if(res.state === 'loading') {
          //     console.log('settings: loading')
          //   } else if(res.state === 'data-not-found') {
          //     console.log('settings: data-not-found')
          //   } else {
          //     console.log(`settings: ${res.value}`)
          //   }
          // }),
        )
      }

      return this.fbStore.doc<Settings>(`users/${usrReq.value.uid}/settings/SETTINGS_UID`).snapshotChanges().pipe(
        map((res): DataRequest<Settings> => {
          const data = res.payload.data()
          if(data === undefined) return {state: 'data-not-found'}
          return {state: 'data-found', value: data}
        }),
        startWith({state: 'loading'} as DataRequest<Settings>),
        // tap(res => {
        //   if(res.state === 'loading') {
        //     console.log('settings: loading')
        //   } else if(res.state === 'data-not-found') {
        //     console.log('settings: data-not-found')
        //   } else {
        //     console.log(`settings: ${res.value}`)
        //   }
        // }),
      )
    }),
    
  )

  // fbSettings$ = this.authService.user$.pipe(
  //   tap((usrReq) => {
  //     if (usrReq.state === 'loading') {
  //       console.log('user: loading');
  //     } else if (usrReq.state === 'data-not-found') {
  //       console.log('user: data-not-found');
  //     } else {
  //       console.log(`user: ${usrReq.value.email}`);
  //     }
  //   }),
  //   distinctUntilChanged(),
  //   switchMap(this.fetchData.bind(this))
  //   // map(this.validateData.bind(this))
  // )

  /**
   * Public properties, depending directly of '_settings$'
   */
  settings$ = this._settings$.asObservable();
  settings = toSignal(this.settings$, { requireSync: true });

  constructor() {
    // this.fbSettings$.subscribe((res) => this._settings$.next(res));
  }

  // private fetchData(
  //   usrReq: DataRequest<User>
  // ): Observable<DataRequest<Settings>> {
  //   if (usrReq.state === 'loading') {
  //     return of({ state: 'loading' } as DataRequest<{
  //       timezone: Timezone;
  //       dateFormat: DateFormat;
  //     }>);
  //   }
  //   if (usrReq.state === 'data-not-found') {
  //     return of({ state: 'data-not-found' } as DataRequest<{
  //       timezone: Timezone;
  //       dateFormat: DateFormat;
  //     }>).pipe(
  //       startWith({ state: 'loading' } as DataRequest<{
  //         timezone: Timezone;
  //         dateFormat: DateFormat;
  //       }>),
  //       tap((res) => {
  //         if (res.state === 'loading') {
  //           console.log('settings: loading');
  //         } else if (res.state === 'data-not-found') {
  //           console.log('settings: data-not-found');
  //         } else {
  //           console.log(`settings: ${res.value}`);
  //         }
  //       })
  //     );
  //   }

  //   return this.fbStore
  //     .doc<{ timezone: Timezone; dateFormat: DateFormat }>(
  //       `users/${usrReq.value.uid}/settings/SETTINGS_UID`
  //     )
  //     .snapshotChanges()
  //     .pipe(
  //       map(
  //         (
  //           res
  //         ): DataRequest<{ timezone: Timezone; dateFormat: DateFormat }> => {
  //           const data = res.payload.data();
  //           if (data === undefined) return { state: 'data-not-found' };
  //           return { state: 'data-found', value: data };
  //         }
  //       ),
  //       startWith({ state: 'loading' } as DataRequest<{
  //         timezone: Timezone;
  //         dateFormat: DateFormat;
  //       }>),
  //       tap((res) => {
  //         if (res.state === 'loading') {
  //           console.log('settings: loading');
  //         } else if (res.state === 'data-not-found') {
  //           console.log('settings: data-not-found');
  //         } else {
  //           console.log(`settings: ${res.value}`);
  //         }
  //       })
  //     );
  // }

  // private validateData(
  //   dataReq: Observable<DataRequest<Settings>>
  // ): DataRequest<Settings> {
  //   if (dataReq === undefined) return undefined;
  //   if (dataReq === null || dataReq === undefined) return this.DEFAULT_VALUES;

  //   const isSettings = isObject<Settings>(dataReq, {
  //     timezone: [isTimezone],
  //     dateFormat: [isDateFormat],
  //   });

  //   if (!isSettings)
  //     throw new CustomTypeError(
  //       `Fetched Data are invalid, not Settings: ${dataReq}`
  //     );
  //   return dataReq;
  // }

  /********** OLD: TO BE DELETED **********/
  dateFormat$ = this.fromProp<DateFormat>(
    this.settings$,
    'dateFormat',
    DateFormat.PLATFORM_DEFINED
  );
  dateFormat = toSignal(this.dateFormat$, { requireSync: true });
  timezone$ = this.fromProp<Timezone>(
    this.settings$,
    'timezone',
    Timezone.PLATFORM_DEFINED
  );
  timezone = toSignal(this.timezone$, { requireSync: true });

  private fromProp<R, T extends Record<string, any> = any>(
    obs: Observable<T | null | undefined>,
    prop: keyof T,
    nullValue: R
  ) {
    return obs.pipe(
      map((val) => {
        switch (val) {
          case undefined:
            return undefined;
          case null:
            return nullValue;
          default:
            return val[prop] === undefined ? nullValue : (val[prop] as R);
        }
      }),
      distinctUntilChanged()
    );
  }
  /********** OLD: TO BE DELETED **********/
}

// /********** MOCK *********/

// let MOCK_DATA: any = {
//   timezone: Timezone.INDIAN_MAURITIUS,
//   dateFormat: DateFormat.US
// }

// // let MOCK_DATA: any = null

// // let MOCK_DATA: any = {
// //   timezone: Timezone.INDIAN_MAURITIUS,
// // }

// async function delay(ms: number): Promise<void> {
//   return new Promise(resolve => setTimeout(() => resolve(), ms))
// }

// async function fetchData() {
//   await delay(700)
//   return MOCK_DATA === undefined ? null : MOCK_DATA
// }

// async function saveData(data: any) {
//   await delay(100)
//   MOCK_DATA = data
// }

// /********** MOCK *********/

// type Settings = {
//   timezone: Timezone,
//   dateFormat: DateFormat
// }

// interface SettingsServiceInterface {
//   settings$: Observable<Settings | undefined>
//   settings: Signal<Settings | undefined>
//   dateFormat$: Observable<DateFormat | undefined>
//   dateFormat: Signal<DateFormat | undefined>
//   timezone$: Observable<Timezone | undefined>
//   timezone: Signal<Timezone | undefined>
//   update: (options: Settings) => Promise<void>
//   // delete: (props?: (keyof Settings)[]) => Promise<void>
// }

// @Injectable({providedIn: 'root'})
// export class SettingsService implements SettingsServiceInterface {

//   private DEFAULT_VALUES: Settings = {
//     timezone: Timezone.PLATFORM_DEFINED,
//     dateFormat: DateFormat.PLATFORM_DEFINED
//   }

//   private _settings$ = new BehaviorSubject<Settings | undefined>(undefined)
//   settings$ = this._settings$.asObservable().pipe(
//     distinctUntilChanged((prev, curr) => prev?.timezone === curr?.timezone && prev?.dateFormat === curr?.dateFormat)
//   )
//   settings = toSignal(this.settings$, {requireSync: true})

//   dateFormat$ = this.fromProp<DateFormat>(this.settings$, 'dateFormat', DateFormat.PLATFORM_DEFINED)
//   dateFormat = toSignal(this.dateFormat$, {requireSync: true})

//   timezone$ = this.fromProp<Timezone>(this.settings$, 'timezone', Timezone.PLATFORM_DEFINED)
//   timezone = toSignal(this.timezone$, {requireSync: true})

//   constructor() {
//     fetchData().then(data => {
//       this._settings$.next(this.fromData(data))
//     })
//   }

//   async update(options: Settings) {
//     const newSettings = {...this._settings$.value, ...options}
//     await saveData(this.toData(newSettings))
//     this._settings$.next(newSettings)
//   }

//   private fromProp<R, T extends Record<string, any> = any>(obs: Observable<T | null | undefined>, prop: keyof T, nullValue: R) {
//     return obs.pipe(
//       map(val => {
//         switch(val) {
//           case undefined: return undefined
//           case null: return nullValue
//           default: return val[prop]  === undefined ? nullValue : val[prop] as R
//         }
//       }),
//       distinctUntilChanged()
//     )
//   }

//   private fromData(data: any): Settings {
//     if(data === null || data === undefined) return this.DEFAULT_VALUES

//     const getDateFormat = (val: any) => {
//       if(!isDateFormat(val)) throw new CustomTypeError(`Invalid dateFormat data: ${val}`)
//       return val
//     }

//     const getTimezone = (val: string | null) => {
//       if(!isTimezone(val)) throw new CustomTypeError(`Invalid timezone data: ${val}`)
//       return val
//     }

//     const settings: Settings = {
//       dateFormat: getDateFormat(data.dateFormat),
//       timezone: getTimezone(data.timezone)
//     }

//     return settings
//   }

//   private toData(data: Settings): Settings | null {
//     const isDefaultObject = data.dateFormat === this.DEFAULT_VALUES.dateFormat && data.timezone === this.DEFAULT_VALUES.timezone
//     return isDefaultObject ? null : data
//   }

// }
