import { Observable } from "rxjs"
import { Identifiable } from "./Identifiable"

export interface DocumentStore<T extends Record<string, any>> {
	/**
	*  - Create a listener to the document changes, emits the current document value or undefined if it doesn’t exist.
	*  - Never errors (it returns always a value, no matter if the document exist or not).
	*/
	get$: () => Observable<Identifiable<T> | undefined>

	/**
	*  - Creates a new document with the specified uid or with a generated unique uid if “uid” parameter is omitted.
	*    If a document already exists with the provided “uid” parameter, it will be overwritten (watch out when providing
    *    an “uid” parameter!)
	*  - Resolves (void) when created and saved successfully
	*  - Never rejects (in any case a document will be created or overwritten!)
	*  - Resolve function is usually not necessary since the changes will be reflected to the “get$()” method, but may be
	*    useful for debugging or when actions are required upon successful savings.
	*/
	set: (item: T, uid?: string) => Promise<void>

	/**
	*  - Updates an existing document.
	*  - Resolves (void) when updated and saved successfully 
	*  - Rejects if the document doesn’t exist (update-failed--no-document-found).
	*  - Resolve and reject functions are usually not necessary since the changes will be reflected to the “get$()” method, but may be
	*    useful for debugging or when actions are required upon successful savings.
	*/
	update: (opts: Partial<T>) => Promise<void>

	/**
	*  - Clears the document from the database. Understand it as the same of calling “set(undefined)”
	*  - Resolves (void) when cleared is successful.
	*  - Rejects if the document doesn’t exist (cleared-failed--no-document-found).
	*  - Resolve and reject functions are usually not necessary since the changes will be reflected to the “get$()” method, but may be
	*    useful for debugging or when actions are required upon successful savings.
	*/
	clear: () => Promise<void>
}

