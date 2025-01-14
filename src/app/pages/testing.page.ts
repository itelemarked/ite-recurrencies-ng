import { Component, inject } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>TESTING</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="ion-padding">
      <p>Testing works!</p>
    </ion-content>
  `,
  styles: ``,
})
export class TestingPage {

  // afs = inject(AngularFirestore)
  firestore = inject(Firestore);

  constructor() {
    // this.afs.collection('users/0yuA0RLZFJdbRKtVSfW4y5HSQMq1/recurrencies').valueChanges().subscribe(console.log)
  }

} 