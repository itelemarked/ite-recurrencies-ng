import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonRadio,
  IonRadioGroup,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';

type ModalInput = {
  categoryList: string[];
  category: string | null;
};

type ModalOutput = {
  category: string | null;
};

@Component({
  selector: 'app-recurrency-list-item-details-input-category',
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonRadioGroup,
    IonRadio,
    FormField,
    IonSearchbar,
  ],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="onBackButtonClick()">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Edit Category</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="onCancelClick()">Cancel</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content [forceOverscroll]="false">
      <ion-searchbar
        [formField]="form.filterCtl" 
      />

      <ion-list class="with-list-header" [inset]="true">
        <ion-radio-group
          [formField]="form.categoryCtl" 
        >
          @for (category of filteredCategories(); track category) {
            <ion-item>
              <ion-radio [value]="category">
                {{ category }}
              </ion-radio>
            </ion-item>
          }
        </ion-radio-group>
      </ion-list>
      @if(filteredCategories().length === 0) {
        <ion-button
          class="mx-lg"
          expand="block"
          fill="outline"
          (click)="onAddCategory(form.filterCtl().value())"
        >
          Add '{{ form.filterCtl().value() }}'
        </ion-button>
      }
    </ion-content>
  `,
  styles: [`
    ion-radio-group.ng-touched.ng-invalid ion-item {
      --color: var(--ion-color-danger-tint);
    }
  `],
})
export class RecurrencyListItemDetailsInputCategoryComponent {
  // DEPENDENCIES
  private modalCtrl = inject(ModalController)

  // STATE
  categoryListInput = input.required<string[]>({ alias: 'categoryList' });
  categoryInput = input.required<string | null>({ alias: 'category' });

  private formModel = linkedSignal<{
    filterCtl: string,
    categoryCtl: string | null
  }>(() => ({
    filterCtl: '',
    categoryCtl: this.categoryInput()
  }))

  form = form(this.formModel, (schema) => {
    required(schema.categoryCtl, {message: 'Choose a category please.'})
  })

  state = {
    categoryList: linkedSignal<string[]>(() => this.categoryListInput())
  }

  // SELECTORS
  filteredCategories = computed(() =>
    this.state.categoryList().filter((category) => category
      .toLowerCase()
      .includes(this.form.filterCtl().value().toLowerCase())),
  );

  // ACTIONS
  onBackButtonClick = () => {
    const category = this.form.categoryCtl().value()
    if(category === null) {
      this.form.categoryCtl().markAsTouched()
    } else {
      this.modalCtrl.dismiss(this.form.categoryCtl().value())
    }
  }

  onCancelClick = () => {
    this.modalCtrl.dismiss(this.categoryInput())
  }

  onAddCategory = (category: string) => {
    this.state.categoryList.update(val => [category, ...val])
    this.form.filterCtl().value.set('')
    this.form.categoryCtl().value.set(category)
  }

  // PRIVATE
}
