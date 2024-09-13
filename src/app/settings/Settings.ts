import { signal } from "@angular/core";

class SettingsSingleton {
  private _TIMEZONE = signal('UTC') 

  get TIMEZONE() {
    return this._TIMEZONE;
  }

  fetch(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        this._TIMEZONE.set('+02:00')
        resolve()
      }, 100);
    })
  }
}

export const SETTINGS = new SettingsSingleton()