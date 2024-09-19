import { Component, effect, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonModal, IonDatetime, IonInput } from '@ionic/angular/standalone';
import { combineLatestWith, delay, fromEvent, interval, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { toObservable } from '@angular/core/rxjs-interop'
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SettingsService } from '../settings/settings.service';
import { ISettings } from '../settings/settings.interface';

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

  btn = viewChild('btn', {read: ElementRef})
  clickCounter = signal(-1)
  obs2$ = toObservable(this.clickCounter).pipe(map(val => `From obs2$: ${val}`))

  ngOnInit() {
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

}