import { Observable } from "rxjs"
import { Identifiable } from "./Identifiable"
import { Signal } from "@angular/core"
import { StoreError } from "./StoreError"


export interface CollectionStoreInterface<T extends Record<string, any>> {
	
	readonly isLoading$: Observable<boolean>
	readonly isLoading: Signal<boolean>
	
	readonly error$: Observable<StoreError | null>
	readonly error: Signal<StoreError | null>

	/**
	*  - Create a listener to the changes of the whole collection. 
	*    Emits the current collection value (as an array) or an empty array if it doesn’t exist.
	*  - Never errors (it returns always a value as array, no matter if the collection exist or not).
	*/
	readonly collection$: Observable<Identifiable<T>[] | null | undefined>
	readonly collection: Signal<Identifiable<T>[] | null | undefined>

	/**
	*  - Create a listener to the changes of the document corresponding to the provided uid of the collection. 
	*    Emits the current document value or undefined if it doesn’t exist.
	*  - Never errors (it returns always a value, no matter if the document exist or not).
	*/
	// get$: (uid : string) => Observable<Identifiable<T> | null>

	/**
	*  - Updates an existing document corresponding to the provided uid of the collection.
	*  - Resolves (void) when updated and saved successfully 
	*  - Rejects if the document doesn’t exist (update-failed--no-document-found).
	*  - Resolve and reject functions are usually not necessary since the changes will be reflected to the “get$()” and getAll$() methods, but may be
	*    useful for debugging or when actions are required upon successful savings.
	*/
	update: (uid : string, opts: Partial<T>) => void

	/**
	*  - adds a document to the collection. A unique “uid” is generated automatically.
	*  - Resolves (void) when added and saved successfully 
	*  - Never rejects (in any case a unique uid-ed document will be added!)
	*  - Resolve function are usually not necessary since the changes will be reflected to the “get$()” and getAll$() methods, but may be
	*    useful for debugging or when actions are required upon successful savings.
	*/
	add: (item : T) => void

	/**
	*  - removes a document corresponding to the provided uid from the collection.
	*  - Resolves (void) when removed and saved successfully 
	*  - Rejects if a document with provided uid doesn’t exist in the collection.
	*  - Resolve function are usually not necessary since the changes will be reflected to the “get$()” and getAll$() methods, but may be
	*    useful for debugging or when actions are required upon successful savings.
	*/
	remove: (uid : string) => void

	/**
	*  - Clears the collection from the database.
	*  - Resolves (void) when cleared is successful.
	*  - Rejects if the document doesn’t exist (cleared-failed--no-document-found).
	*  - Resolve and reject functions are usually not necessary since the changes will be reflected to the “get$()” and getAll$() methods,, but may be
	*    useful for debugging or when actions are required upon successful savings.
	*/
	clear: () => void
}