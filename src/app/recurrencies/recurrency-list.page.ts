import { Component, computed, inject, signal, viewChild } from '@angular/core';
import {
  createAnimation,
  IonActionSheet,
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { RecurrencyListItemComponent } from './components/recurrency-list-item.component';
import { RecurrencyMockService } from './services/recurrency-mock.service';
import { addIcons } from 'ionicons';
import { ellipsisHorizontalOutline } from 'ionicons/icons';
import { groupBy } from './utils/array';
import { blurActiveElement } from './utils/ionic-fixes';
import { TIMEZONE } from './types/Timezone';
import { DATE_FORMAT } from './types/DateFormat';
import { get, get$, MOCK_DATAS, remove, set } from './services/mock-datas';
import { Recurrency } from './types/Recurrency.type';


const slideInLeft = (baseEl: HTMLElement) => {
  const root = baseEl.shadowRoot;

  const backdropAnimation = createAnimation()
    backdropAnimation
    .addElement(root!.querySelector('ion-backdrop')!)
    .fromTo('opacity', '0.01', '1');

  const wrapperAnimation = createAnimation()
  wrapperAnimation
    .addElement(root!.querySelector('.modal-wrapper')!)
    .keyframes([
      { offset: 0, transform: 'translateX(100%)' },
      { offset: 1, transform: 'translateX(0)' },
    ]);

  return createAnimation()
    .addElement(baseEl)
    .easing('ease-out')
    .duration(200)
    .addAnimation([wrapperAnimation, backdropAnimation])
};

const slideInRight = (baseEl: HTMLElement) => {
  const root = baseEl.shadowRoot;

  const backdropAnimation = createAnimation()
    backdropAnimation
    .addElement(root!.querySelector('ion-backdrop')!)
    .fromTo('opacity', '1', '0.01');

  const wrapperAnimation = createAnimation()
  wrapperAnimation
    .addElement(root!.querySelector('.modal-wrapper')!)
    .keyframes([
      { offset: 0, transform: 'translateX(0)' },
      { offset: 1, transform: 'translateX(100%)' },
    ]);

  return createAnimation()
    .addElement(baseEl)
    .easing('ease-out')
    .duration(200)
    .addAnimation([wrapperAnimation, backdropAnimation])
};



@Component({
  selector: 'app-recurrency-list',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonButtons,
    IonButton,
    IonIcon,
    IonLabel,
    IonItem,
    IonActionSheet,
    IonModal,
    IonNote,
    IonInput,
    IonDatetime,
    IonSelect,
    IonSelectOption,
    RecurrencyListItemComponent,
  ],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-title> RecurrencyList </ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="menuButton.onPresentListActions()">
            <ion-icon
              slot="icon-only"
              name="ellipsis-horizontal-outline"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">

      <div class="recurrencyList">
        @for(grouped of recurrencyList.groupedByCategory(); track grouped[0]) {
        <label style="margin-left: 16px; color: grey; font-weight: bold;">{{ grouped[0] }}</label>
        <ion-list [inset]="true" class="mt-sm">
          <!-- <ion-list-header>
            <ion-label>{{ grouped[0] }}</ion-label>
          </ion-list-header> -->
          @for( recurrency of grouped[1]; track recurrency.uid ) {
          <recurrency-list-item
            [recurrency]="recurrency"
            [timezone]="timezone"
            [dateFormat]="dateFormat"
            (click)="onItemClick(recurrency)"
          />
          }
        </ion-list>
        }
      </div>

      <div class="listActions">
        <ion-action-sheet
          [isOpen]="listActions.isOpen()"
          [buttons]="listActions.buttons"
          (willDismiss)="listActions.isOpen.set(false)"
        ></ion-action-sheet>
      </div>

      <div class="edit-modal">
        <div>
        <ion-modal
          style="--ion-background-color: #121212;"
          #modalEdit
          [isOpen]="editModal.isOpen"
          [initialBreakpoint]="0.7"
          (willDismiss)="editModal.isOpen = false"
          [canDismiss]="false"
          [enterAnimation]="editModal.slideInLeft"
          [leaveAnimation]="editModal.slideInRight"
        >
          <ng-template>
            <ion-header collapse="fade" [translucent]="true">
              <ion-toolbar>
                <ion-buttons slot="start">
                  <!-- TODO: when opening modal, set canDismiss to false -->
                  <ion-button (click)="modalEdit.canDismiss = true; modalEdit.isOpen = false">
                    <!-- <ion-icon
                      slot="icon-only"
                      name="ellipsis-horizontal-outline"
                    /> -->
                    Close
                  </ion-button>
                </ion-buttons>
                <ion-title> Edit </ion-title>
              </ion-toolbar>
            </ion-header>
            <ion-content [forceOverscroll]="false">

              <ion-list [inset]="true">
                <ion-item [button]="true" (click)="onItemTitleClick()">
                  <ion-label>Title</ion-label>
                  <ion-note>choose</ion-note>
                </ion-item>
                <ion-item [button]="true">
                  <ion-label>Last Event</ion-label>
                  <ion-note>choose</ion-note>
                </ion-item>
                <ion-item [button]="true">
                  <ion-label>Period Nb</ion-label>
                  <ion-note>choose</ion-note>
                </ion-item>
                <ion-item [button]="true">
                  <ion-label>Period Unit</ion-label>
                  <ion-note>choose</ion-note>
                </ion-item>
                <ion-item [button]="true">
                  <ion-label>Expiry</ion-label>
                  <ion-note>choose</ion-note>
                </ion-item>
                <ion-item [button]="true">
                  <ion-label>Category</ion-label>
                  <ion-note>choose</ion-note>
                </ion-item>
              </ion-list>

              <!-- <ion-list>
                <div class="app-item">
                  <div class="app-item-inner">
                    <label>Title</label>
                    <input type="text" placeholder="title"/>
                  </div>
                </div>
                <div class="app-item">
                  <div class="app-item-inner">
                    <label>Last Event</label>
                    <input type="date" value="2000-01-01"/>
                  </div>
                </div>
                <div class="app-item">
                  <div class="app-item-inner">
                    <label>Period Number</label>
                    <input type="number" placeholder="choose"/>
                  </div>
                </div>
                <div class="app-item">
                  <div class="app-item-inner">
                    <label>Period Unit</label>
                    <select name="cars" id="cars">
                      <option value="empty"></option>
                      <option value="days">Days</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                </div>
                <div class="app-item">
                  <div class="app-item-inner">
                    <label>Expiry</label>
                    <input type="date"  value="2000-01-01"/>
                  </div>
                </div>
                <div class="app-item">
                  <div class="app-item-inner">
                    <label>Category</label>
                    <input type="text" placeholder="category"/>
                  </div>
                </div> -->
<!--                 
                <ion-item>
                  <ion-input
                    label="Title"
                    placeholder="title"
                  />
                </ion-item>
                <ion-item>
                  <ion-input
                    label="Last event"
                    placeholder="date"
                    [disabled]="true"
                    style="opacity: 1;"
                  />
                </ion-item>
                <ion-item>
                  <ion-input
                    label="Period number"
                    placeholder="number"
                  />
                </ion-item>
                <ion-item>
                  <ion-select label="Period unit" placeholder="unit">
                    <ion-select-option value="days">Days</ion-select-option>
                    <ion-select-option value="months">Months</ion-select-option>
                    <ion-select-option value="years">Years</ion-select-option>
                  </ion-select>
                </ion-item>
                <ion-item>
                  <ion-input
                    label="Expiry"
                    placeholder="date"
                  />
                </ion-item>
                <ion-item>
                  <ion-input
                    label="Category"
                    placeholder="category"
                  />
                </ion-item>
                <ion-item>
                  <ion-label>Something</ion-label>
                  <input type="text" placeholder="data" style="background: none; border: none; text-align: right; outline: none;">
                </ion-item>

                <div class="app-item">
                  <div class="app-item-inner">
                    <label>Something3</label>
                    <input type="text" placeholder="abcd"/>
                  </div>
                </div>

                <ion-item>
                  <ion-label>Something4</ion-label>
                  <input type="text" placeholder="data">
                </ion-item> 
              </ion-list>-->
            </ion-content>
          </ng-template>
        </ion-modal>
        </div>
      </div>

      <div class="edit-title-modal">
        <ion-modal
          style="--ion-background-color: #121212;"
          [isOpen]="editTitleModal.isOpen"
          [enterAnimation]="editModal.slideInLeft"
          [leaveAnimation]="editModal.slideInRight"
          (ionModalDidPresent)="onEditTitleModalDidPresent()"
          (willDismiss)="editTitleModal.isOpen = false"
        >
          <ng-template>
            <ion-header collapse="fade" [translucent]="true">
              <ion-toolbar>
                <ion-buttons slot="start">
                  <!-- TODO: when opening modal, set canDismiss to false -->
                  <ion-button (click)="editTitleModal.isOpen = false">
                    <!-- <ion-icon
                      slot="icon-only"
                      name="ellipsis-horizontal-outline"
                    /> -->
                    Close
                  </ion-button>
                </ion-buttons>
                <ion-title> Title </ion-title>
              </ion-toolbar>
            </ion-header>
            <ion-content [forceOverscroll]="false">

              <ion-list [inset]="true">
                <ion-item>
                  <ion-input
                    id="titleInputEl"
                    #titleInputEl
                    type="text"
                    placeholder="Enter a title"
                  />
                </ion-item>
              </ion-list>
            </ion-content>
          </ng-template>
        </ion-modal>
      </div>

    </ion-content>
  `,
  styles: [`
    .app-item {
      background-color: var(--ion-color-step-50);
    }  

    .app-item-inner {
      display: flex;
      min-height: 44px;
      margin-left: 16px;
      margin-right: 16px;
      align-items: center;
      border-bottom: 1px solid var(--ion-color-step-250, #c8c7cc);
    }

    .app-item-inner label{
      flex-grow: 1;
    }

    .app-item-inner input,
    .app-item-inner select {
      background: none; 
      border: none; 
      outline: none;
    }

    .app-item-inner input[type="text"],
    .app-item-inner input[type="number"] {
      field-sizing: content;
    }
  `],
})
export class RecurrencyListPage {
  private recurrencyService = inject(RecurrencyMockService);
  timezone = TIMEZONE.ZURICH;
  dateFormat = DATE_FORMAT.CH;

  menuButton = {
    onPresentListActions: () => {
      blurActiveElement();
      this.listActions.isOpen.set(true);
    },
  };

  recurrencyList = {
    groupedByCategory: computed(() => {
      return groupBy(
        this.recurrencyService.recurrencies(),
        ({ category }) => category
      );
    }),
  };

  listActions: any = {
    isOpen: signal(false),
    buttons: [
      {
        text: 'Add Item',
        handler: () => {
          console.log('add item clicked');
          blurActiveElement();
          this.editModal.isOpen = true;
        },
      },
      {
        text: 'Filter by "name"',
        handler: () => {
          // TODO
          console.log('filter by name clicked');
        },
      },
      {
        text: 'Filter by "days left"',
        handler: () => {
          // TODO
          console.log('filter by daysleft clicked');
        },
      },
      {
        text: 'Cancel',
        role: 'cancel',
      },
    ],
  };

  editModal = {
    isOpen: false,
    slideInLeft,
    slideInRight
  };

  

  editTitleModal = {
    isOpen: false,
  }

  constructor() {
    addIcons({ ellipsisHorizontalOutline });

    // TESTING ONLY...
    // setTimeout(() => {
    //   set('users/0yuA0RLZFJdbRKtVSfW4y5HSQMq1/recurrencies/jdfkalswerus', {
    //     title: 'PT',
    //     lastEvent: '2025-12-31',
    //     periodNb: 9,
    //     periodUnit: 'days',
    //     category: 'Aircrafts',
    //   });
    // }, 3000);
  }

  onItemClick(recurrency: Recurrency) {
    this.editModal.isOpen = true
  }

  onItemTitleClick() {
    this.editTitleModal.isOpen = true
  }

  titleInputEl = viewChild('titleInputEl', {
    read: IonInput
  })

  onEditTitleModalDidPresent() {
    const titleInputEl = document.getElementById('titleInputEl') as unknown as IonInput
    console.log(titleInputEl)
    // setTimeout(() => {
      titleInputEl.setFocus()
    // }, 1000);
    // this.titleInputEl()!.setFocus()
  }
}

