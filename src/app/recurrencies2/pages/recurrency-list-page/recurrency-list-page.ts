import { Component, computed, effect, inject, input, signal } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { addIcons } from 'ionicons';
import { ellipsisHorizontalOutline } from 'ionicons/icons';

import { ListActionSheet } from "./list-action-sheet/list-actions-sheet";
import { RecurrencyList } from "./recurrency-list/recurrency-list";
import { RecurrencyService } from "../../services/recurrency-service";
import { Recurrency } from "../../types/Recurrency";
import { RecurrencyDetailsModal } from "./recurrency-details-modal/recurreny-details-modal";
import { SettingsService } from "../../../settings/settings.service";



type RecurrencyDetailsModalOptions = { isOpen: false, recurrency: null } | { isOpen: true, recurrency: Recurrency | null }


@Component({
  selector: 'app-recurrency-list-page',
  imports: [
    IonicModule,
    RecurrencyList,
    ListActionSheet,
    RecurrencyDetailsModal
],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-title>Recurrencies</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="onOpenActionSheet()">
            <ion-icon slot="icon-only" name="ellipsis-horizontal-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">
      <app-recurrency-list
        [recurrencies]="recurrencies()"
        (add)="onAddRecurrency()"
        (remove)="onRemoveRecurrencyById($event)"
        (edit)="onEditRecurrencyById($event)"
        (today)="onToday()"
      />
    </ion-content>

    <app-list-action-sheet
      [isOpen]="actionSheetIsOpen()"
      (add)="onActionSheetAdd()"
      (filterBy)="onActionSheetFilterBy($event)"
      (cancel)="onActionSheetCancel()"
    />

    <app-recurrency-details-modal
      [isOpen]="recurrencyDetailsModalOptions().isOpen"
      [recurrency]="recurrencyDetailsModalOptions().recurrency"
      (ok)="onRecurrencyDetailsModalOk()"
      (cancel)="onRecurrencyDetailsModalCancel()"
    />
  `,
  styles: [``]
})
export class RecurrencyListPage {
  // DEPENDENCIES
  private recurrencyService = inject(RecurrencyService)
  private settingsService = inject(SettingsService)

  // STATE
  private state = {
    actionSheetIsOpen: signal<boolean>(false),
    recurrencyDetailsModalOptions: signal<RecurrencyDetailsModalOptions>({isOpen: false, recurrency: null})
  }

  // SELECTORS
  protected recurrencies = computed(() => this.recurrencyService.recurrencies())
  protected actionSheetIsOpen = computed(() => this.state.actionSheetIsOpen())
  protected recurrencyDetailsModalOptions = computed(() => this.state.recurrencyDetailsModalOptions())

  // ACTIONS
  constructor() {
    addIcons({ ellipsisHorizontalOutline });
  }

  protected onOpenActionSheet = () => {
    this.state.actionSheetIsOpen.set(true)
  }

  protected onAddRecurrency = () => {
    this.state.recurrencyDetailsModalOptions.set({
      isOpen: true,
      recurrency: null
    })
  }
  protected onRemoveRecurrencyById = (uid: string) => {
    // TODO
  }

  protected onEditRecurrencyById = (uid: string) => {
    // TODO
  }

  protected onToday = () => {
    // TODO
  }

  protected onActionSheetAdd = () => {
    this.state.actionSheetIsOpen.set(false)
    this.state.recurrencyDetailsModalOptions.set({isOpen: true, recurrency: null})
  }

  protected onActionSheetFilterBy = (filter: 'title' | 'expiry') => {
    // TODO
    this.state.actionSheetIsOpen.set(false)
  }

  protected onActionSheetCancel = () => {
    this.state.actionSheetIsOpen.set(false)
  }

  protected onRecurrencyDetailsModalOk = () => {
    this.state.recurrencyDetailsModalOptions.set({isOpen: false, recurrency: null})
  }

  protected onRecurrencyDetailsModalCancel = () => {
    this.state.recurrencyDetailsModalOptions.set({isOpen: false, recurrency: null})
  }

  // PRIVATE

}