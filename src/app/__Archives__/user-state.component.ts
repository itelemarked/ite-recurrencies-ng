// import { Component, computed, input, output } from '@angular/core';

// import { IonButton, IonIcon, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
// import { addIcons } from 'ionicons';
// import { personCircleOutline } from 'ionicons/icons';
// import { NgIf } from '@angular/common';

// @Component({
//   selector: 'user-state',
//   standalone: true,
//   imports: [
//     NgIf,
//     IonList,
//     IonItem,
//     IonIcon,
//     IonLabel,
//     IonButton,
//   ],
//   template: `
//     <app-list>
//       <header>USER</header>
//       <ng-container *ngIf="isLoggedIn()">
//         <ion-list [inset]="true">
//           <ion-item>
//             <ion-icon name="person-circle-outline" slot="start" />
//             <ion-label>{{ user()!.email }}</ion-label>
//             <ion-button color="danger" fill="outline" (click)="logout.emit()">logout</ion-button>
//           </ion-item>
//         </ion-list>
//       </ng-container>

//       <ng-container *ngIf="isLoggedOut()">
//         <ion-list [inset]="true">
//           <ion-item button (click)="login.emit()">
//             <ion-icon name="person-circle-outline" slot="start" color="danger" />
//             <ion-label>Need to login?</ion-label>
//           </ion-item>
//         </ion-list>
//       </ng-container>
//       <footer>**Logged-in users have their datas backed-up on a google server. The datas of unregistered users are stored in the browser memory (data lost is not guaranteed...)**</footer>
//     </app-list>
//   `,
//   styles: `
//     ion-icon {
//       font-size: 3.5em;
//     }
//   `,
// })
// export class UserStateComponent {

//   user = input.required<User | null | undefined>()
//   login = output<void>()
//   logout = output<void>()

//   isLoggedOut = computed(() => this.user() === null)
//   isLoggedIn = computed(() => this.user() !== null && this.user() !== undefined)

//   constructor() {
//     addIcons({ personCircleOutline })
//   }

// }