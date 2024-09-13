import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonModal, IonDatetime, IonInput } from '@ionic/angular/standalone';
import { Recurrency } from '../recurrency/Recurrency.model';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import { RecurrencyService } from '../recurrency/recurrency.service';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
import { Datum } from '../recurrency/Datum.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ISettings } from '../settings/settings.interface';
import { FirebaseDocumentStore } from '../../core/stores/firebase-store.model';
import { SettingsService } from '../settings/settings.service';

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
    
    </ion-content>
  `,
  styles: ``,
})
export class TestPage {

  private firestore = inject(AngularFirestore)
  private auth = inject(AngularFireAuth)
  private authService = inject(AuthService)
  private settingsService = inject(SettingsService)

  constructor() {
    effect(() => console.log(this.settingsService.get$()()))
    setTimeout(() => {
      this.authService.login('aaa@aaa.com', '111111')
    }, 2000);
    const rmk = 'this line was added on github'
  }

  getPath$(): Observable<string | undefined> {
    const user$ = toObservable(this.authService.userSig)
    return user$.pipe(
      map(usr => !!usr ? `users/${usr.id()}/settings/0`: undefined)
    )
  }

  // constructor() {
  //   const path$ = toSignal(this.getPath$(), {initialValue: undefined})
  //   const store = new FirebaseDocumentStore(path$)
  //   store.get$<ISettings>().subscribe(console.log)
  // }

  // getPath$(): Observable<string | undefined> {
  //   const user$ = toObservable(this.authService.userSig)
  //   return user$.pipe(
  //     map(usr => !!usr ? `users/${usr.id()}/settings/0`: undefined)
  //   )
  // }

  getSettings$(): Observable<ISettings | undefined> {
    const path$ = this.getPath$()
    return path$.pipe(
      switchMap(path => {
        if(!!path) {
          return this.firestore.doc<ISettings>(path).valueChanges()
        }
        return of(undefined)
      })
    )
  }

  // getSettings$(): Observable<ISettings | undefined> {
  //   const user$ = toObservable(this.authService.userSig)
  //   return user$.pipe(
  //     switchMap(usr => {
  //       if(!!usr) {
  //         return this.firestore.doc<ISettings>(`users/${usr.id()}/settings/0`).valueChanges()
  //       }
  //       return of(undefined)
  //     })
  //   )
  // }

}
