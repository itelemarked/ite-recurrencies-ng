import { Component, computed, input, output, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonSkeletonText, IonThumbnail } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';

import { AppListComponent } from '@app/components/app-list.component';
import { User } from '@app/types/User.type';


@Component({
  selector: 'app-user-settings-list',
  standalone: true,
  imports: [
    CommonModule,
    AppListComponent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonButton,
    IonThumbnail,
    IonSkeletonText
  ],
  template: `
    <app-list>
      <header>USER SETTINGS</header>
      <ng-container *ngIf="state() === 'authenticated'">
        <ion-list [inset]="true" class="mx-0">
          <ion-item>
            <ion-icon name="person-circle-outline" slot="start" />
            <ion-label>{{ user()!.email }}</ion-label>
            <ion-button color="danger" fill="outline" (click)="logout.emit()">logout</ion-button>
          </ion-item>
        </ion-list>
      </ng-container>

      <ng-container *ngIf="state() === 'not-authenticated'">
        <ion-list [inset]="true" class="mx-0">
          <ion-item button (click)="authenticate.emit()">
            <ion-icon name="person-circle-outline" slot="start" color="danger" />
            <ion-label>Need to login?</ion-label>
          </ion-item>
        </ion-list>
      </ng-container>

      <ng-container *ngIf="state() === 'loading'">
        <ion-list [inset]="true">
          <ion-item>
            <ion-thumbnail slot="start" sltyle="font-size: 3.5em;">
              <ion-skeleton-text [animated]="true" style="--border-radius: 9999px;"></ion-skeleton-text>
            </ion-thumbnail>
            <ion-label>
              <ion-skeleton-text [animated]="true"/>
            </ion-label>
          </ion-item>
        </ion-list>
      </ng-container>

      <footer>**Logged-in users have their datas backed up on a google server. The datas of unregistered users are stored in the browser memory (data persistence is not guaranteed...)**</footer>
    </app-list>
  `,
  styles: `
    ion-icon {
      font-size: 3.5em;
    }
    ion-item {
      --min-height: 70px;
    }
  `,
})
export class UserSettingsListComponent {

  loading = input<boolean>(false)
  user = input<User | null | undefined>(undefined)
  
  authenticate = output<void>()
  logout = output<void>()

  state = computed(() => this.getState(this.loading(), this.user()))

  constructor() {
    addIcons({ personCircleOutline })
  }

  private getState(loading: boolean, user: User | null | undefined) {
    if(loading || user === undefined) return 'loading'
    if(user === null) return 'not-authenticated'
    return 'authenticated'
  }

}