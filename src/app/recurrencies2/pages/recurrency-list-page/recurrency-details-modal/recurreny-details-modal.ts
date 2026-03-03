import { Component, computed, input, linkedSignal, output } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { Recurrency } from "../../../types/Recurrency";

@Component({
  selector: 'app-recurrency-details-modal',
  imports: [
    IonicModule
  ],
  template: `
    <ion-modal [isOpen]="isOpen()">
      <ng-template>

        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button (click)="onOk()">OK</ion-button>
            </ion-buttons>
            <ion-title>Details</ion-title>
            <ion-buttons slot="end">
              <ion-button (click)="onCancel()">Cancel</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          details here...
        </ion-content>
        
      </ng-template>
    </ion-modal>
  `,
  styles: [``]
})
export class RecurrencyDetailsModal {
  // DEPENDENCIES

  // STATE
  isOpenInput = input.required<boolean>({alias: 'isOpen'})
  recurrencyInput = input.required<Recurrency | null>({alias: 'recurrency'})
  // okOutput = output<Recurrency>({alias: 'ok'})
  okOutput = output<void>({alias: 'ok'})
  cancelOutput = output<void>({alias: 'cancel'})

  private state = {
    
  }

  // SELECTORS
  protected isOpen = computed(() => this.isOpenInput())

  // ACTIONS
  protected onOk = () => this.okOutput.emit()
  protected onCancel = () => this.cancelOutput.emit()

  // PRIVATE

}