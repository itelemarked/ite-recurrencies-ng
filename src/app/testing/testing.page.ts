
import { Component, inject } from "@angular/core";
import { IonContent, IonHeader,IonTitle, IonToolbar, ModalController } from "@ionic/angular/standalone";
import { FormsModule } from "@angular/forms";
import { RecurrencyListItemDetailsInputCategoryComponent } from "../recurrencies/components/recurrency-list-item-details-input-category.modal";
import { slideInLeft, slideInRight } from "../../js/ionic/animations/modals/slide-in";
import { addIcons } from "ionicons";
import { chevronBackOutline, closeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-testing-page',
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-title>
          Testing
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content [forceOverscroll]="false">
      
      <p>Testing Component works!</p>

    </ion-content>
  `,
  styles: [``]
})
export class TestingPage {
  private modalCtrl = inject(ModalController)

  constructor() {
    addIcons({
      chevronBackOutline,
      closeCircleOutline
    })
  }

  async ngOnInit() {
    const modal = await this.modalCtrl.create({
      component: RecurrencyListItemDetailsInputCategoryComponent,
      componentProps: {
        categoryList: ['Aircrafts', 'Survival'],
        category: null
      },
      enterAnimation: slideInLeft,
      leaveAnimation: slideInRight
    })
    modal.present()
    const data = (await modal.onWillDismiss()).data! as string | null
    console.log(data) 
  }
}


