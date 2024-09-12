import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonModal, IonDatetime, IonInput } from '@ionic/angular/standalone';
import { Recurrency } from '../recurrency/types/Recurrency.model';
import { BehaviorSubject, map, of } from 'rxjs';
import { RecurrencyService } from '../recurrency/recurrency.service';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
import { SettingsService } from '../settings/settings.service';
import { toSignal } from '@angular/core/rxjs-interop'

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

  private _settingsService = inject(SettingsService)
  private _recurrencyService = inject(RecurrencyService)

  constructor() {
    // const rec = new Recurrency('abcd', '2022-12-06', 99, 'days')
    // setTimeout(() => {
    //   this._recurrencyService.add(rec)
    // }, 2000);
  }

  // ngOnInit(): void {
  //   this.recService.recurrencies$.subscribe(res => {
  //     console.log(res.map(r => ({title: r.title(), lastEvent: r.lastEvent().toString()})))
  //   })

  //   // setTimeout(() => {
  //   //   const newRec = new Recurrency('aaa', '2020-12-20', 99, 'days', 'xyzabcd')
  //   //   this.recService.add(newRec).then(_ => console.log('Add.then()'))
  //   // }, 2000);

  //   // setTimeout(() => {
  //   //   this.auth.login('aaa@aaa.com', '111111')
  //   // }, 4000);
  // }

}