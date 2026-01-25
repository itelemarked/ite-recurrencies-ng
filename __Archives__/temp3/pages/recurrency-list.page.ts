import { Component } from "@angular/core";
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonNote, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { CommonModule, NgFor } from "@angular/common";

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
    IonItem,
    IonLabel,
    IonNote
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          RecurrencyList
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content [forceOverscroll]="false">

       <!-- <ion-list>
        <ng-container *ngFor="let item of items()">
          <recurrency-list-item
            [title]="item.title"
            [description]="item.description"
            [note]="item.note"
          />
        </ng-container>
       </ion-list> -->

    </ion-content>
  `,
  styles: [``]
})
export class RecurrencyListPage {
  // recurrencies = inject(RecurrencyServiceFirebase).get()

  // sortBy: 'title' | 'expiryDate' = 'expiryDate'

  // items = computed(() => {
  //   return this.recurrencies().map(r => {
  //     const title = r.title
  //     const uid = r.uid
  //     const expiryDate = endOf(add(new Date(r.lastEvent), r.periodNb, r.periodUnit),'days', 'Europe/Zurich')
  //     const todayDate = endOf(new Date(), 'days', 'Europe/Zurich')
  //     const description = `Expires: ${format(expiryDate, DATE_FORMAT.CH, TIMEZONE.ZURICH)}`
  //     const daysLeft = diff(expiryDate, todayDate, 'days')
  //     const note = daysLeft < 0 ? 
  //       'expired...': 
  //       daysLeft === 0 ?
  //       'expires today evening!!':
  //       `${daysLeft} days left...`
  //       return { title, description, note, uid, expiryDate }
  //   })
  //   // .sort((a,b) => {
  //   //   switch(this.sortBy) {
  //   //     case 'expiryDate': {
  //   //       return a.expiryDate.valueOf() - b.expiryDate.valueOf()
  //   //     }
  //   //     case 'title': {
  //   //       return a.title - b.title
  //   //     }
  //   //   }
  //   // })
  // })

  // constructor() {
  //   // const d1 = new Date('2025-06-06T12:00')
  //   // const d2 = new Date('2025-06-08T11:59')
  //   // console.log(diff(d1, d2, 'days'))
  // }
  
  // // items = computed(() => this.toItems(this.recurrencies(), this.dateFormat, this.timezone))

  // // // Utils
  // private toRecurrencyItem(recurrencyData: Data<Recurrency>, dateFormat: DateFormat, timezone: Timezone) {
  //   return []
  // }

}