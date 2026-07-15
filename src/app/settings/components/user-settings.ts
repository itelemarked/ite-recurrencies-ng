import { Component, input, output } from "@angular/core";
import { IonicModule } from '@ionic/angular';

import { User } from "../../_types/User";

import { AppList } from "../../_shared/app-list";


@Component({
  standalone: true,
  selector: 'app-user-settings',
  imports: [
    IonicModule,
    AppList
  ],
  template: `
    <app-list>
      <ion-header>User</ion-header>
      @if(user() !== undefined && user() !== null) {
        <ion-item>
          <ion-label>{{ user()!.email }}</ion-label>
          <ion-button slot="end" color="danger" fill="outline" (click)="logout.emit()">logout</ion-button>
        </ion-item>
      } @else {
        <ion-item button (click)="authenticate.emit()">Login</ion-item>
      }
    </app-list>
  `,
  styles: [``]
})
export class UserSettings {
  user = input.required<User | null | undefined>()
  authenticate = output<void>()
  logout = output<void>()
}