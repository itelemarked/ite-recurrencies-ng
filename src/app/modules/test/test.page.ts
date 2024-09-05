import { Component, computed, OnInit, signal } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonModal, IonDatetime, IonInput } from '@ionic/angular/standalone';
import { Recurrency } from '../recurrency/Recurrency';
import { BehaviorSubject, of } from 'rxjs';
import { RecurrencyService } from '../recurrency/recurrency.service';

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
      <p>value: {{ inputValue }}</p>
      <ion-button (click)="isModalOpen = true">open modal</ion-button>
      <p>Counter: {{ counter() }}</p>

      <ion-modal [isOpen]="isModalOpen">
        <ng-template>
          <ion-header>
            <ion-toolbar>
              <ion-title>Modal</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <ion-input [(ngModel)]="inputValue"></ion-input>
            <ion-button (click)="isModalOpen = false">ok</ion-button>
          </ion-content>
        </ng-template>
      </ion-modal>
    
    </ion-content>
  `,
  styles: ``,
})
export class TestPage implements OnInit {

  isModalOpen = false
  inputValue = 99

  settings = signal({
    count: 999
  })

  counter = computed(() => this.settings().count)

  _user$ = new BehaviorSubject({id: '0yuA0RLZFJdbRKtVSfW4y5HSQMq'})
  user$ = this._user$.asObservable()

  constructor(
    private recService: RecurrencyService
  ) {
    this.recService.get$(this.user$).subscribe(console.log)

    setTimeout(() => {
      this._user$.next({id: '0yuA0RLZFJdbRKtVSfW4y5HSQMq1'})
    }, 3000);
  
    const newRec = {
      title: 'new Recurrency 6',
      lastEvent: '2000-01-01',
      periodNb: 99,
      periodUnit: 'daaays'
    }

    // this.store.delete('users/0yuA0RLZFJdbRKtVSfW4y5HSQMq1/recurrencies/iBHVgbuDm9NnfY1wAEjg')
  }

  ngOnInit(): void {
    
  }

}