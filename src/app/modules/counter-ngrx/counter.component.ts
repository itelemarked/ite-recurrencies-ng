import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { decrement, increment, init, selectCount, selectDoubleCount } from "./counter.store";


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

  constructor(private store: Store<{counter: number}>) {
    this.count$ = store.select(selectCount)
    this.doubleCount$ = store.select(selectDoubleCount)
  }

  ngOnInit(): void {
    // may be done in AppComponent as well...
    this.store.dispatch(init())
  }

  increment() {
    this.store.dispatch(increment({value: 2}))
  }

  decrement() {
    this.store.dispatch(decrement({value: 3}))
  }

}