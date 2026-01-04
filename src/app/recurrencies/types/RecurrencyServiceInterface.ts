
import { Observable } from "rxjs";
import { Recurrency } from "../models/Recurrency.model";

export interface RecurrencyServiceInterface {
  recurrencies$: () => Observable<Recurrency[]>
}
