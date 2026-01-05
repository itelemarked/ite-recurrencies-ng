import { Component, computed, input, output } from '@angular/core';
import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';


// @Component({
//   selector: 'recurrency-list-item',
//   standalone: true,
//   imports: [
//     IonItem,
//     IonLabel,
//     IonNote,
//     IonItemSliding,
//     IonItemOptions,
//     IonItemOption,
//     IonIcon,
//   ],
//   template: `
//     <ion-item-sliding #slidingItem>
//       <ion-item [button]="true">
//         <ion-label>
//           <h2>{{ title() }}</h2>
//           <p>{{ expiry() }}</p>
//         </ion-label>
//         <ion-note slot="end">{{ note() }}</ion-note>
//       </ion-item>

//       <ion-item-options side="end">
//         <ion-item-option color="danger">
//           <ion-icon slot="icon-only" name="trash" (click)="slidingItem.close(); delete.emit()"></ion-icon>
//         </ion-item-option>
//       </ion-item-options>
//     </ion-item-sliding>
//   `,
//   styles: ``,
// })
// export class RecurrencyListItemComponent {
//   recurrency = input.required<Recurrency>();

//   title = computed(() => this.recurrency().title)
//   expiry = computed(() => {
//     const lastEventDate = new Date(this.recurrency().lastEvent)
//     const periodNb = this.recurrency().periodNb
//     const periodUnit = this.recurrency().periodUnit
//     const expiryDate = add(lastEventDate, periodNb, periodUnit)
//     const expiryString = format(expiryDate, 'ch', 'Europe/Zurich')
//     return `Expires: ${expiryString}`
//   })

//   delete = output()

//   constructor() {
//     addIcons({ trash });
//   }
// }

// function getExpiryDate(recurrency: Recurrency, settings: Settings): Date {
//   const { lastEvent, periodNb, periodUnit } = recurrency

// }


@Component({
  selector: 'recurrency-list-item2',
  standalone: true,
  imports: [
    IonItem,
    IonLabel,
    IonNote,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonIcon,
  ],
  template: `
    <ion-item-sliding #slidingItem>
      <ion-item [button]="true">
        <ion-label>
          <h2>{{ title() }}</h2>
          <p>{{ description() }}</p>
        </ion-label>
        <ion-note slot="end">{{ note() }}</ion-note>
      </ion-item>

      <ion-item-options side="end">
        <ion-item-option color="danger">
          <ion-icon slot="icon-only" name="trash" (click)="slidingItem.close(); delete.emit()"></ion-icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  `,
  styles: ``,
})
export class RecurrencyListItem2Component {
  title = input.required<string>();
  description = input.required<string>();
  note = input.required<string>();

  delete = output()

  constructor() {
    addIcons({ trash });
  }
}
