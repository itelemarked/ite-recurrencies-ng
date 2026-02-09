
import { Component, inject, signal } from "@angular/core";
import { IonContent, IonHeader,IonTitle, IonToolbar, ModalController } from "@ionic/angular/standalone";
import { FormsModule } from "@angular/forms";
import { RecurrencyListItemDetailsInputCategoryComponent } from "../recurrencies/components/recurrency-list-item-details-input-category.modal";
import { slideInLeft, slideInRight } from "../../js/ionic/animations/modals/slide-in";
import { addIcons } from "ionicons";
import { chevronBackOutline, closeCircleOutline } from 'ionicons/icons';
import { CategoryComponent } from "./category";
import { ListComponent } from "./app-list.component";
import { IonicModule } from "@ionic/angular";
import { ItemDirective } from "./app-item.directive";

@Component({
  selector: 'app-testing-page',
  standalone: true,
  imports: [
    FormsModule,
    IonicModule,
    CategoryComponent,
    ListComponent,
    ItemDirective
],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="onBackButtonClick()">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Testing</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="onCancelClick()">
            Cancel
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content [forceOverscroll]="false">
      
      <!-- <p>Testing Component works!</p> -->

      <app-category
        [categories]="['Aaaa', 'Bbbb']"
        [category]="'Bbbb'"
      />


      <!-- <app-list
        class="category-list"
        title="Categories"
        helperText="Choose a category here"
      >
        <ion-radio-group>
          <ion-item appItem [textColor]="aircraftItemColor()">
            <ion-radio>Aircraft</ion-radio>
          </ion-item>
          <ion-item [style.color]="'var(--ion-color-primary)'">
            <ion-radio>Survival</ion-radio>
          </ion-item>
        </ion-radio-group>
      </app-list>

      <app-list>
        <ion-item appItem textColor="warning">
          <ion-input
            type="text"
          />
        </ion-item>
      </app-list> -->

    </ion-content>
  `,
  styles: [``]
})
export class TestingPage {

  aircraftItemColor = signal<string | null | undefined>(undefined)

  constructor() {
    addIcons({chevronBackOutline, closeCircleOutline})
  }

  onBackButtonClick() {}

  onCancelClick() {}

}


