import { Component, inject, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { onAuthStateChanged } from 'firebase/auth';
import { FirebaseService } from '../../core/firebase-service';
import { UserFirebaseService } from '../../recurrencies/services/user-firebase-service';

@Component({
  selector: 'app-testing-user-firebase-service',
  imports: [IonicModule],
  template: `
    <div>
      fbUser: {{ fbUser()?.email ?? 'null' }} <br />
      -------------------- <br />
      isLoading: {{ userService.isLoading() }} <br />
      user: {{ userService.user()?.email ?? 'null' }} <br />
      error: {{ userService.error() ?? 'null' }} <br />
    </div>

    <div>
      <ion-button size="small" (click)="onLogin('aaa')">Login 'aaa'</ion-button> <br />
      <ion-button size="small" (click)="onLogin('bbb')">Login 'bbb'</ion-button> <br />
      <ion-button size="small" (click)="onLogin('invalid')">Login 'invalid'</ion-button> <br />
      <ion-button size="small" (click)="onLogout()">Logout'</ion-button> <br />
      <ion-button size="small" (click)="onSignup('ccc')">Signup 'ccc'</ion-button> <br />
      <ion-button size="small" (click)="onSignup('aaa')">Signup 'aaa'</ion-button> <br />
      <ion-button size="small" (click)="onSignup('deleteCcc')">Delete 'currentUser'</ion-button>
      <br />
    </div>
  `,
  styles: [``],
})
export class TestingUserFirebaseService {
  userService = inject(UserFirebaseService);

  // only to use onAuthStateChanged() to get the fbUser...
  private auth = inject(FirebaseService).auth;
  fbUser = signal(this.auth.currentUser);

  constructor() {
    onAuthStateChanged(this.auth, (fbUser) => {
      this.fbUser.set(fbUser);
    });
  }

  onLogin = (s: 'aaa' | 'bbb' | 'invalid') => {
    if (s === 'aaa') {
      this.userService.login('aaa@aaa.com', '111111').then((res) => {
        console.log(`logged 'aaa' in`);
        console.log(`state.isLoading: ${res.isLoading}`);
        console.log('-------');
      });
    } else if (s === 'bbb') {
      this.userService.login('bbb@bbb.com', '222222').then((res) => {
        console.log(`logged 'bbb' in`);
        console.log(`state.isLoading: ${res.isLoading}`);
        console.log('-------');
      });
    } else {
      this.userService.login('a@a.com', '123456').then((res) => {
        console.log(`logged 'invalid' in`);
        console.log(`state.isLoading: ${res.isLoading}`);
        console.log('-------');
      });
    }
  };

  onLogout = () => {
    this.userService.logout().then((res) => console.log(res.user));
  };

  onSignup = (s: 'ccc' | 'aaa' | 'deleteCcc') => {
    if (s === 'ccc') {
      this.userService.signup('ccc@ccc.com', '333333').then((res) => {
        console.log(`signed 'ccc' in`);
      });
    } else if (s === 'aaa') {
      this.userService.signup('aaa@aaa.com', '111111').then((res) => {
        console.log(`signed 'aaa' in`);
      });
    } else {
      this.userService.deleteCurrentUser().then((res) => {
        console.log('currentUser deleted');
      });
    }
  };
}
