import { Observable } from "rxjs"
import { Identifiable } from "./Identifiable"


export interface CollectionInterface<T extends Record<string, any>> {
	/**
	*  - Create a listener to the changes of the document corresponding to the provided uid of the collection. 
	*    Emits the current document value or undefined if it doesn’t exist.
	*  - Never errors (it returns always a value, no matter if the document exist or not).
	*/
	get$: (uid : string) => Observable<Identifiable<T> | null>

	/**
	*  - Create a listener to the changes of the whole collection. 
	*    Emits the current collection value (as an array) or an empty array if it doesn’t exist.
	*  - Never errors (it returns always a value as array, no matter if the collection exist or not).
	*/
	getAll$: () => Observable<Identifiable<T>[]>

	/**
	*  - Updates an existing document corresponding to the provided uid of the collection.
	*  - Resolves (void) when updated and saved successfully 
	*  - Rejects if the document doesn’t exist (update-failed--no-document-found).
	*  - Resolve and reject functions are usually not necessary since the changes will be reflected to the “get$()” and getAll$() methods, but may be
	*    useful for debugging or when actions are required upon successful savings.
	*/
	update: (uid : string, opts: Partial<T>) => Promise<void>

	/**
	*  - adds a document to the collection. A unique “uid” is generated automatically.
	*  - Resolves (void) when added and saved successfully 
	*  - Never rejects (in any case a unique uid-ed document will be added!)
	*  - Resolve function are usually not necessary since the changes will be reflected to the “get$()” and getAll$() methods, but may be
	*    useful for debugging or when actions are required upon successful savings.
	*/
	add: (item : T) => Promise<void>

	/**
	*  - removes a document corresponding to the provided uid from the collection.
	*  - Resolves (void) when removed and saved successfully 
	*  - Rejects if a document with provided uid doesn’t exist in the collection.
	*  - Resolve function are usually not necessary since the changes will be reflected to the “get$()” and getAll$() methods, but may be
	*    useful for debugging or when actions are required upon successful savings.
	*/
	remove: (uid : string) => Promise<void>

	/**
	*  - Clears the collection from the database.
	*  - Resolves (void) when cleared is successful.
	*  - Rejects if the document doesn’t exist (cleared-failed--no-document-found).
	*  - Resolve and reject functions are usually not necessary since the changes will be reflected to the “get$()” and getAll$() methods,, but may be
	*    useful for debugging or when actions are required upon successful savings.
	*/
	clear: () => Promise<void>
}