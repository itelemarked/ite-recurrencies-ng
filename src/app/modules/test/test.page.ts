import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonModal, IonDatetime, IonInput } from '@ionic/angular/standalone';

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

  constructor() {
    setTimeout(() => {
      console.log('timeout')
      this.settings.set({
        count: 1000
      })
    }, 3000);
  }

  ngOnInit(): void {
    
  }

}