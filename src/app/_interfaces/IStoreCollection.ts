import { Signal } from "@angular/core"
import { Observable } from "rxjs"

export interface IStoreCollection<T> {
  getAll$(): Signal<T[]>
  getById$(id: string): T | null

  /**
   * It adds (no id provided, or the recurrency id doesn't match any data id) or update (the recurrency id already exists on the server) the passed recurrency.
   * 
   * Resolved when:
   * - the recurrency has been successfully saved on the server. (NB: it doesn't resolve if the value is cached for a later automatic save, e.g if the server or the wifi is not available yet)
   * 
   * Rejected if:
   * - no user is currently logged in (User === null)
   * 
   * @param recurrency - the recurrency (with or without id) to be saved.
   * @returns a Promise wich resolve with the recurrency saved. If no id was provided, one has been created upon saving to the server
   */
  save(item: T): Promise<T>
  remove(id: string): Promise<T>
}
