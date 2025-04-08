import { computed, effect, inject, Injectable, signal, untracked } from "@angular/core"
import { AuthService } from "./auth.service"
import { Recurrency, toRecurrency } from "@shared/types/Recurrency"
import { STORE } from "./_MOCK_DATAS"
import { User } from "@shared/types/User"
import { TimezoneString, toTimezoneString } from "@shared/types/TimezoneString"
import { format } from "@shared/utils/date/date.utils"

/**
 *  This is a MOCK service...
 */
@Injectable({providedIn: 'root'})
export class RecurrencyService {

  // DEPENDENCIES
  private authService = inject(AuthService)
  private settingsService = signal({ timezone: toTimezoneString('UTC') }) // TODO: replace settingsService!
  private MOCK_STORE: any = STORE

  private _recurrencies = signal<Recurrency[] | undefined>(undefined)
  public recurrencies = computed(() => this._recurrencies())

  public isLoading = computed(() => this._recurrencies() === undefined)

  constructor() {
    effect(() => {
      const user = this.authService.user()
      const timezone = this.settingsService().timezone

      untracked(() => {
        if (user === null || user === undefined) {
          this._recurrencies.set([])
        } else {
          // this._recurrencies.set(this.getMockRecurrencies(user, timezone))
        }
      })
    })
  }

  /**
   * Delete the data corresponding to the given id.
   * Returns:
   *   - the recurrency which has been deleted.
   *   - undefined if the recurrency has not been found (user is unregistered or recurrency doesn't exists)
   */
  async delete(id: string): Promise<Recurrency | undefined> {
    const user = this.authService.user()
    const timezone = this.settingsService().timezone

    return new Promise((resolve) => {
      if (user === null || user === undefined) {
        resolve(undefined)
      } else if (this.MOCK_STORE?.users[user.uid]?.recurrencies[id] === undefined) {
        resolve(undefined)
      } else {
        // const recurrency = this.MOCK_STORE?.users[user.uid]?.recurrencies[id]
        // delete this.MOCK_STORE?.users[user.uid]?.recurrencies[id]
        // // this._recurrencies.update(recs => recs?.filter(rec => rec.id !== id))
        // const res = await this.simulatedFetch(user, timezone)
        // this._recurrencies.set(res)
        // resolve(res)
      }
    })
  }

  /**
   * Adds the recurrency to the list of data if it doesn't exists yet,
   * or overwrite an existing recurrency (identified by id)
   */
  // save(recurrency: Recurrency): Promise<'modified' | 'added'> {
  //   const timezone = 'UTC'

  //   const id = recurrency.id ?? this.generateUid()
  //   const dateString = format(recurrency.lastEvent, 'YYYY-MM-DD', timezone)
  // }

  private generateUid(): string {
    return Math.round(Math.random() * 10000000).toString()
  }

  private simulatedFetch(user: User, timezone: TimezoneString, DELAY = 500): Promise<Recurrency[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const fetchedRecurrencies = Object.entries(this.MOCK_STORE?.users[user.uid]?.recurrencies).map(([uid, data]) => toRecurrency(data, timezone, uid))
        this._recurrencies.set(fetchedRecurrencies)
      }, DELAY);
    })
  }

}