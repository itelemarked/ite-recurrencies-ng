import { Component, effect, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonModal, IonDatetime, IonInput } from '@ionic/angular/standalone';
import { combineLatestWith, delay, firstValueFrom, from, fromEvent, interval, lastValueFrom, map, mergeMap, Observable, of, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { toObservable } from '@angular/core/rxjs-interop'
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SettingsService } from '../settings/settings.service';
import { ISettings } from '../_interfaces/ISettings';
import { RecurrencyService } from '../recurrency/recurrency.service';
import { toPeriodUnit } from '../_types/PeriodUnit';
import { toPositiveInteger } from '../_types/PositiveInteger';
import { toDateString } from '../_types/DateString';
import { toRecurrency } from '../_interfaces/IRecurrency';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonModal, IonDatetime, IonInput],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>TestPage</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">

      <p>TestPage works</p>
      <ion-button #btn (click)="clickCounter.set(clickCounter() + 1)">Click me</ion-button>
    
    </ion-content>
  `,
  styles: ``,
})
export class TestPage {

  private rec = inject(RecurrencyService)

  constructor() {
    // this.testSave()
    // this.testRemove()

  }

  recService = inject(RecurrencyService)

  toRecurrencyTest() {
    toRecurrency({
      id: 'aaa',
      title: 'aaa',
      lastEvent: '2022-02-02',
      periodNb: 99,
      periodUnit: 'daysss'
    })
  }

  testRemove() {
    setTimeout(() => {
      this.recService.remove('abcdefgh')
      .then(val => {
        console.log(`removed resolved:`)
        console.log(val)
      })
      .catch(err => {
        console.log(`removed rejected`)
        console.log(err)
      })
    }, 6000);
  }

  testSave() {
    setTimeout(() => {
      this.recService.save({
        id: 'abcdefgh',
        title: 'bbb',
        lastEvent: toDateString('2022-01-01'),
        periodNb: toPositiveInteger(100),
        periodUnit: toPeriodUnit('days')
      })
      .then(val => {
        console.log(`saved resolved:`)
        console.log(val)
      })
      .catch(err => {
        console.log(`saved rejected`)
        console.log(err)
      })
    }, 3000);
  }



  btn = viewChild('btn', {read: ElementRef})
  clickCounter = signal(-1)
  obs2$ = toObservable(this.clickCounter).pipe(map(val => `From obs2$: ${val}`))

  testSwitchObservables() {
    const obs1$ = interval(8000).pipe(map(val => `From obs1$: ${val}`))
    // const obs2$ = fromEvent(this.btn()?.nativeElement, 'click').pipe(map(_ => `  From obs2$: clicked`))
    const obs2$ = this.obs2$
    const obs3$ = interval(1000).pipe(delay(8100), map(val => `From obs3$: ${val}`))

    // const switch$ = obs1$.pipe(
    //   tap(console.log),
    //   switchMap(_ => obs2$),
    //   tap(console.log),
    //   switchMap(_ => obs3$),
    // )

    const combine$ = obs1$.pipe(
      tap(_ => console.log(`--- obs$1 fired! ---`)),
      combineLatestWith(obs2$.pipe(tap(_ => console.log(`--- obs$2 fired! ---`)) )),
      map( ([e1, e2]) => [e1, e2]),
      combineLatestWith(obs3$),
      map( ([e12, e3]) => [...e12, e3])
    )

    // obs2$.subscribe(console.log)
    // switch$.pipe(take(10)).subscribe(console.log)
    combine$.pipe(take(20)).subscribe( ([e1, e2, e3]) => console.log(`${e3}, [${e1}, ${e2}]`))
  }


  testMergeMap() {
    // const obs1$ = interval(5000).pipe(
    //   tap(_ => console.log('obs1$ fires')),
    //   map(val => `From obs1$: ${val}`)
    // )

    const obs2$ = interval(1000).pipe(
      // delay(5100), 
      tap(_ => console.log('obs2$ fires')),
      map(val => `From obs2$: ${val}`)
    )

    // const obs3$ = from(new Promise<string>((resolve, reject) => {
    //   setTimeout(() => {
    //     reject('abcd')
    //   }, 3000);
    // }))

    // obs1$.pipe(
    //   switchMap(val => obs2$),
    //   take(20),
    // ).subscribe()

    // obs3$.subscribe({
    //   next: () => console.log(`Promise resolved`),
    // })

    const promise1 = firstValueFrom(obs2$)
    promise1.then(val => console.log(val))
  }

}