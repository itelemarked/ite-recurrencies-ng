import { Observable } from "rxjs"
import { Identifiable } from "./Identifiable"
import { Signal } from "@angular/core"
import { StoreError } from "./StoreError"

export interface DocumentStoreInterface<T extends Record<string, any>> {

	readonly isLoading$: Observable<boolean>
	readonly isLoading: Signal<boolean>
	
	readonly error$: Observable<StoreError | null>
	readonly error: Signal<StoreError | null>

	/**
	*  - Create a listener to the document changes, emits the current document value or undefined if it doesn’t exist.
	*  - Never errors (it returns always a value, no matter if the document exist or not).
	*/
	readonly doc$: Observable<Identifiable<T> | null | undefined>
	readonly doc: Signal<Identifiable<T> | null | undefined>

	/**
	*/
	set: (item: T) => void

	/**
	*/
	update: (opts: Partial<T>) => void

	/**
	*/
	clear: () => void
}

