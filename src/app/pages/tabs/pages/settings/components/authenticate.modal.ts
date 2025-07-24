import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, input, signal } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { AuthService } from '@app/services/auth.service';
import { User } from '@app/types/User.type';

@Component({
  selector: 'app-authenticate',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="ion-padding">
      <div class="flex items-center px-md my-md outline">
        <span class="flex-1">User info:</span>
        <span> {{ userInfo() }}</span>
      </div>

      <div class="flex items-center px-md my-md outline">
        <span class="flex-1">Log 'aaa' in</span>
        <ion-button
          size="small"
          (click)="onButtonClick('aaa')"
          >aaa</ion-button
        >
      </div>

      <div class="flex items-center px-md my-md outline">
        <span class="flex-1">Log 'bbb' in</span>
        <ion-button
          size="small"
          (click)="onButtonClick('bbb')"
          >bbb</ion-button
        >
      </div>

      <div class="flex items-center px-md my-md outline">
        <span class="flex-1">Logout</span>
        <ion-button size="small" color="danger"
          (click)="onButtonClick('logout')"
          >Logout</ion-button
        >
      </div>
    </ion-content>
  `,
  styles: [
    `
      .outline {
        border: solid 1px grey;
        height: 50px;
      }
    `,
  ],
})
export class AuthenticateModal {
  private modalCtrl = inject(ModalController)

  @Input({required: true})
  user: User | null | undefined

  userInfo = () => {
    const usr = this.user
    if(usr === undefined) return 'loading'
    if(usr === null) return 'not-authenticated'
    return usr.email
  }

  onButtonClick(val: 'aaa' | 'bbb' | 'logout') {
    this.modalCtrl.dismiss(val)
  }

}
