import { inject, Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { BehaviorSubject, map, of, skip, switchMap, take, tap } from "rxjs";


import { SettingsService } from "./settings.service";

import { Recurrency, RecurrencyData, toRecurrency, toRecurrencyData } from "../types/Recurrency";

import { endOf } from "../utils/date/date.utils";




/**
 * Recurrencies must be updated/emitted when:
 * a) the user changes (have to fetch data on firestore)
 * b) the timezone changes (the "lastEvent: Date" time must be updated to the new timezone.)
 */

@Injectable({providedIn: 'root'})
export class RecurrencyService {}