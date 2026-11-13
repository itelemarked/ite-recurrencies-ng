import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DATE_FORMAT, DateFormat, Settings, Timezone } from '../../settings/settings.model';
import { SettingsService } from '../../settings/settings';

const DEFAULT_SETTINGS: Settings = {
  timezone: 'Europe/Zurich',
  dateFormat: DATE_FORMAT.CH_DATE_TIME,
};

@Component({
  selector: 'app-settings-simple',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonicModule],
  template: `
    <!-- Settings Input List -->
    <ion-list lines="full" class="ion-margin-bottom">
      <ion-item>
        <ion-input
          label="Timezone"
          labelPlacement="stacked"
          fill="outline"
          [value]="currentSettings().timezone"
          (ionChange)="onUpdate('timezone', $any($event).detail.value)"
        />
      </ion-item>

      <ion-item>
        <ion-input
          label="Date Format"
          labelPlacement="stacked"
          fill="outline"
          [value]="currentSettings().dateFormat"
          (ionChange)="onUpdate('dateFormat', $any($event).detail.value)"
        />
      </ion-item>
    </ion-list>

    <!-- Bottom Status Divs -->
    <div>isLoading: {{ settingsService.isLoading() }}</div>
    <div>error: {{ errorDisplay() }}</div>
  `,
})
export class SettingsSimpleComponent {
  protected readonly settingsService = inject(SettingsService);

  protected readonly currentSettings = computed<Settings>(() => {
    return this.settingsService.item() ?? DEFAULT_SETTINGS;
  });

  protected readonly errorDisplay = computed(() => {
    const err = this.settingsService.error();
    return err ? `${err.code} - ${err.details}` : 'null';
  });

  protected onUpdate<K extends keyof Settings>(field: K, value: string | null | undefined): void {
    if (typeof value !== 'string') return;

    this.settingsService.setDoc({
      ...this.currentSettings(),
      [field]: value as Timezone | DateFormat,
    });
  }
}
