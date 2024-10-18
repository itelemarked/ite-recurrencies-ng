import { Component, inject } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { StepperInputComponent } from './forms--custom-inputs/stepper-input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextComponent } from './forms--custom-inputs/input-text.component';
import { CommonModule } from '@angular/common';
import { InputIonicComponent } from './forms--input-ionic/input-ionic.component';
import { pipe } from './js--pipe/pipe';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonInput,

    StepperInputComponent,
    InputTextComponent,
    InputIonicComponent,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" [forceOverscroll]="false">
      <form [formGroup]="form" (ngSubmit)="onSubmit($event)">
        <!-- StepperInputComponent -->
        <!-- <div>
          <style>
            /*Override standard component invalid color*/
            .stepper-input {
              --color-invalid: yellow;
            }
          </style>
          <app-stepper-input class="stepper-input" [increment]="20" formControlName="stepperCtl" />
        </div> -->

        <!-- InputTextComponent -->
        <!-- <app-input-text
          label="Email"
          formControlName="emailCtl"
        /> -->

        <!-- Native IonInput -->
        <!-- <style>
          ion-input {
            --highlight-color-valid: cyan;
            --highlight-color-invalid: yellow;
          }
        </style>
        <ion-input
          label="Email"
          label-placement="stacked"
          fill="outline"
          mode="md"
          placeholder="Enter email"
          formControlName="emailCtl"
          errorText="this is an error..."
        />
        <div *ngIf="emailCtl.touched && emailCtl.invalid && emailCtl.hasError('required')">
          Enter an email...
        </div> -->

        <!-- input-ionic -->
        <app-input-ionic>
          <ion-input
            label="Email"

            fill="outline"
            mode="md"
            placeholder="Enter email"
          />
        </app-input-ionic>

        <ion-button
          class="ion-margin-top"
          type="submit"
          expand="full"
          size="small"
          >submit</ion-button
        >
      </form>
    </ion-content>
  `,
  styles: ``,
})
export class TestingPage {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    emailCtl: ['ab', [Validators.required, Validators.minLength(3)]],
  });

  get emailCtl() {
    return this.form.get('emailCtl')!;
  }

  constructor() {
    const result = pipe(
      toBool,
      toString,
      reverse
    )(2)

    console.log(result)
  
  }

  onSubmit(e: SubmitEvent) {
    e.preventDefault();
  }
}


const toBool = (n: number) => n === 1 ? true : false

const toString = (b: boolean): string => b ? 'true ' : 'false'

const reverse = (s: string) => s.split('').reverse().join('')





