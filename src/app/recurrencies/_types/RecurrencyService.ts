import { Recurrency } from "./Recurrency";

export interface RecurrencyService {
  getAll: () => Promise<Recurrency[]>
}