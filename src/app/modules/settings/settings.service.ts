import { Injectable } from "@angular/core";


const SETTINGS = {
  timezone: '+02:00'
}


@Injectable({providedIn: 'root'})
export class SettingsService {

  timezone(): string {
    return SETTINGS.timezone
  }

}