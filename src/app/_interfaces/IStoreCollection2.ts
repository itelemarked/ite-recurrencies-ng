import { Signal } from "@angular/core"
import { Observable } from "rxjs"

export interface IStoreCollection2<T> {
  /**
   * Get the list (collection) of all items. 
   * Items must be of type key-value pairs.
   */
  getAll$(): Observable<T[]>

  /**
   * Get the item by key
   * @param key 
   */
  get$(key: string): Observable<T | null>

  /**
   * Add an item to the list
   * @param value 
   */
  add(value: T): Promise<{key: string, value: T}> 


  /**
   * Sets an item to the list. If the key already exists, it overwrites the data. If the key doesn't exist yet, it create a new data.
   * @param key 
   * @param value 
   */
  set(key: string, value: T): Promise<{key: string, value: T}>

  /**
   * Removes an item with the provided key. If the key is not found in the data, it resolves with 'null'
   * 
   * The promise resolves only when the backend is successfully reached
   * 
   * @param key - the key of the value to be removed
   * @returns - a promise which resolves with the value and key of the removed item. It resolves with "null" if the key doesn't match any data
   */
  remove(key: string): Promise<{key: string, value: T} | null>
}






  // /**
  //  * Saves (if key doesn't exist yet or if no key is provided) or update (if key already exists) the value.
  //  * If key is not provided, it will be automatically generated by the server
  //  * 
  //  * The promise resolves only when the backend is successfully reached
  //  * 
  //  * @param value - the value to be saved
  //  * @param key - optional - the key of the value to save. If not provided, it should be automatically generated from the backend.
  //  * @returns - a promise which resolved with the saved value and the (newly generated) key
  //  */
  // save(value: T, key?: string): Promise<{value: T, key: string}>