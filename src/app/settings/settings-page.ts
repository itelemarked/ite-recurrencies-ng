import { Component } from "@angular/core";
import { IonContent, IonHeader, IonItem, IonList, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { AppList } from "../_shared/components/app-list";

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    AppList
],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-title>
          Settings
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content [forceOverscroll]="false" class="ion-padding">
      SettingsPage works!

      <app-list>
        <div appListHeader>Header</div>
        <ion-list appListItems [inset]="true">
          <ion-item>aaa</ion-item>
        </ion-list>
        <div appListFooter>some footer here</div>
      </app-list>
      
    </ion-content>
  `,
  styles: [``]
})
export class SettingsPage {
  // DEPENDENCIES

  // STATE

  // SELECTORS

  // ACTIONS

  // PRIVATE

}