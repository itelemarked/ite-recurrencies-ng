import { Component, inject } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { StepperInput } from './stepper-input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    StepperInput,
    ReactiveFormsModule,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form [formGroup]="form" (ngSubmit)="onSubmit($event)">
        <div>
          <app-stepper-input class="stepper-input" [increment]="20" formControlName="stepperCtl" />
        </div>
        <ion-button type="submit">submit</ion-button>
      </form>
    </ion-content>
  `,
  styles: `
    /*Override standard component invalid color*/
    .stepper-input {
      --color-invalid: yellow;
    }
  `,
})
export class TestingPage {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    stepperCtl: [50, Validators.max(100)],
  });

  constructor() {}

  onSubmit(e: SubmitEvent) {
    e.preventDefault();
  }
}
