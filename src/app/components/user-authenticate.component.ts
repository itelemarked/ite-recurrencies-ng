// import { Component } from '@angular/core';
// import { AppInputComponent } from './app-input.component';
// import { ReactiveFormsModule } from '@angular/forms';
// import { NgClass, NgIf } from '@angular/common';
// import { IonButton } from '@ionic/angular/standalone';

// @Component({
//   selector: 'user-authenticate',
//   standalone: true,
//   imports: [
//     ReactiveFormsModule,
//     NgClass,
//     NgIf,
//     IonButton,
//     AppInputComponent,
//   ],
//   template: `
//     <!-- AUTH ERRORS -->
//     <div class="ite-auth-errors p-sm mb-lg" *ngIf="errorMessages().length > 0">
//       <div *ngFor="let err of errorMessages()">{{ err }}</div>
//     </div>

//     <form class="form" [formGroup]="form" (ngSubmit)="onSubmit()">
//       <!-- EMAIL CTL -->
//       <app-input
//         class="ite-email-ctl"
//         type="text"
//         label="Email"
//         [formControl]="emailCtl"
//       >
//         <div *ngIf="emailCtl.touched && emailCtl.hasError('email')">
//           Invalid email...
//         </div>
//         <div *ngIf="emailCtl.touched && emailCtl.hasError('required')">
//           Email required...
//         </div>
//       </app-input>

//       <!-- PASSWORD CTL -->
//       <app-input
//         class="ite-password-ctl ion-margin-top"
//         [ngClass]="{ 'ite-password-missmatch': passwordMissmatch() }"
//         type="password"
//         label="Password"
//         [formControl]="passwordCtl"
//       >
//         <div *ngIf="passwordCtl.touched && passwordCtl.hasError('required')">
//           Password required...
//         </div>
//         <div *ngIf="passwordCtl.touched && passwordCtl.hasError('minlength')">
//           Must be at least 6 characters long...
//         </div>
//         <div
//           *ngIf="
//             passwordCtl.touched && passwordCtl.hasError('numericCharacter')
//           "
//         >
//           Numeric character missing...
//         </div>
//         <!-- <div *ngIf="passwordCtl.touched && passwordCtl.hasError('upperCaseCharacter')">Upper case character missing...</div>
//         <div *ngIf="passwordCtl.touched && passwordCtl.hasError('lowerCaseCharacter')">Lower case character missing...</div>
//         <div *ngIf="passwordCtl.touched && passwordCtl.hasError('specialCharacter')">Special character missing...</div> -->
//       </app-input>

//       <!-- CONFIRM PASSWORD CTL -->
//       <app-input
//         *ngIf="loginSignup() === 'signup'"
//         class="ite-confirm-password-ctl ion-margin-top"
//         [ngClass]="{ 'ite-password-missmatch': passwordMissmatch() }"
//         type="password"
//         label="Confirm password"
//         [formControl]="confirmPasswordCtl"
//       >
//         <div
//           *ngIf="
//             confirmPasswordCtl.touched &&
//             confirmPasswordCtl.hasError('required')
//           "
//         >
//           Password confirmation required...
//         </div>
//         <div *ngIf="passwordMissmatch()">Password missmatch...</div>
//       </app-input>

//       <!-- SUBMIT BUTTON -->
//       <div class="ite-submit-button">
//         <ion-button
//           type="submit"
//           class="ion-padding-top"
//           expand="block"
//           [disabled]="this.authService.isLoading$ | async"
//         >
//           {{ this.loginSignup() === 'login' ? 'Login' : 'Signup' }}
//         </ion-button>
//       </div>

//       <!-- SIGNUP/LOGIN COMMENTS -->
//       <div
//         class="ite-signup-login-comments flex ion-justify-content-center ion-align-items-center"
//       >
//         <span class="flex-none">No account yet?</span>
//         <ion-button
//           class="flex-none"
//           fill="clear"
//           [strong]="true"
//           color="primary"
//           [disabled]="this.authService.isLoading$ | async"
//           (click)="onLoginSignupToggle()"
//         >
//           {{ this.loginSignup() === 'login' ? 'Signup' : 'Login' }}
//         </ion-button>
//       </div>
//     </form>
//   `,
//   styles: ``,
// })
// export class UserAuthenticateComponent {
//   constructor() {}
// }


