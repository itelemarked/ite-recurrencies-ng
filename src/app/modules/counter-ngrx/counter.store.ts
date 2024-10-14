import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { createAction, createReducer, createSelector, on, props, Store } from "@ngrx/store";
import { of, switchMap, tap, withLatestFrom } from "rxjs";



// ACTIONS

export const init = createAction(
  '[Counter] init'
)

export const set = createAction(
  '[Counter] set',
  props<{value: number}>()
)

export const increment = createAction(
  '[Counter] Increment',
  props<{value: number}>()
)

export const decrement = createAction(
  '[Counter] Decrement',
  props<{value: number}>()
)



// REDUCER

const initialState = 0;

/**
 * IMPORTANT NOTE: in the reducer, use synchronus and pure functions ONLY!!!
 * See also "effects"
 */
export const counterReducer = createReducer(
  initialState,
  on(increment, (state, action) => state + action.value),
  on(decrement, (state, action) => state - action.value),
  on(set, (state, action) => action.value)
)

// export function counterReducer(state = initialState) {
//   return state
// }



// SELECTORS

export const selectCount = (state: {counter: number}) => state.counter
export const selectDoubleCount = createSelector(
  selectCount,
  (state) => state * 2
)



// EFFECTS
// In case asynchronus actions must be required, use effects
// An extra package must be installed ng add @ngrx/effects
@Injectable()
export class CounterEffects {

  loadCount = createEffect(
    () => 
      this.actions$.pipe(
        ofType(init),
        switchMap(() => {
          const storedCounter = localStorage.getItem('count')
          if (storedCounter) {
            return of(set({value: +storedCounter}))
          }
          return of(set({value: 0}))
        })
      )
  )

  saveCount = createEffect(
    () => 
      this.actions$.pipe(
        ofType(increment, decrement),
        withLatestFrom(this.store.select(selectCount)),
        tap( ([action, counter]) => {
          console.log(action)
          console.log(counter)
          // do some http requests or local storage stuffs here...
          localStorage.setItem('count', counter.toString())
        })
      ),
      { dispatch: false }
  )

  constructor(
    private actions$: Actions,
    private store: Store<{counter: number}>
  ) {}
}


