import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { Store } from "@ngrx/store";
import { map, Observable, of, take } from "rxjs";
import { CounterService, StoreService } from "./counter.store";


@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule, IonButton],
  template: `
    <h3>counter: {{ count$ | async }}</h3>
    <h3>double counter: {{ doubleCount$ | async }}</h3>
    <ion-button (click)="increment()">increment</ion-button>
    <ion-button (click)="decrement()">decrement</ion-button>
  `,
  styles: [``]
})
export class CounterComponent implements OnInit {

  count$: Observable<number>
  doubleCount$: Observable<number>

  constructor(private store: StoreService) {
    this.count$ = this.store.counter.get$()
    this.doubleCount$ = this.count$.pipe(map(val => val * 2))
  }

  ngOnInit(): void {

  }

  increment() {
    const currentValue = this.store.counter.getOnce()
    this.store.counter.set(currentValue + 1)
  }

  decrement() {
    
  }

}