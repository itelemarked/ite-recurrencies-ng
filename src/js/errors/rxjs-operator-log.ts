import { Observable, tap } from "rxjs";

export const log = <T>(id: string) => (source$: Observable<T>) => source$.pipe(
  tap({
    subscribe: () => console.log(`[${id}] subscribed`),
    unsubscribe: () => console.log(`[${id}] unsubscribed`),
    finalize: () => console.log(`[${id}] finalized`),
    next: (val) => console.log(`[${id}] nexts:`, val),
    error: (err) => console.log(`[${id}] errors:`, err),
    complete: () => console.log(`[${id}] completes`,)
  })
)