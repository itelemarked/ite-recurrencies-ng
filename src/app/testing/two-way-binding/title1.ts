import { Component, computed, input, model, output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-title1',
  imports: [IonicModule],
  template: `
    <ion-list [inset]="true">
      <ion-item>
        <ion-input
            type="text"
            [value]="title()"
            (ionInput)="onTitleChange($event.detail.value!)"
        />
      </ion-item>
    </ion-list>
  `,
  styles: [``],
})
export class Title1 {
//   titleInput = input.required<string>({ alias: 'title' });
//   titleChangeOutput = output<string>({ alias: 'titleChange' });
//   title = computed(() => this.titleInput());
//   onTitleChange = (val: string) => this.titleChangeOutput.emit(val);

    title = model.required<string>()
    onTitleChange = (val: string) => this.title.set(val)

}
