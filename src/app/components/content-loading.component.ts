import { CommonModule } from '@angular/common';
import { Component, HostBinding, input, output, signal } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonLoading, IonSpinner } from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';

import { AppInputComponent } from './app-input.component';
import { animate, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-content-loading',
  standalone: true,
  imports: [
    IonSpinner,
  ],
  template: `
    <ion-spinner class="spinner" />
  `,
  animations: [
    trigger('enterLeaveAnimation', [
      transition(':enter', [style({opacity: 0}), animate('500ms')]),
      transition(':leave', [animate('1000ms', style({opacity: 0}))]),
    ]),
  ],
  styles: `
  
    :host {
      --ite-background-color: var(--ion-background-color);
      --ite-background-opacity: 0.95;
      --ite-spinner-color: var(--ion-text-color);
    }

    :host {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      z-index: 3;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--ite-background-color);
      opacity: var(--ite-background-opacity);
    }

    .spinner {
      --color: var(--ite-spinner-color);
    }

  `,
})

export class ContentLoadingComponent {
  @HostBinding('@enterLeaveAnimation') enterLeaveAnimation = true;
}