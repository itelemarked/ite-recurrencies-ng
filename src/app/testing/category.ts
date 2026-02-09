import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { IonicModule, SegmentValue } from '@ionic/angular';
import { CategoryExistingComponent } from './category-existing';
import { ListComponent } from './app-list.component';

@Component({
  selector: 'app-category',
  imports: [
    // IonSegment,
    // IonSegmentButton,
    // IonLabel,
    // IonSegmentView,
    // IonSegmentContent
    IonicModule,
    CategoryExistingComponent,
    ListComponent
  ],
  template: `
    <!-- <ion-segment value="existing">
      <ion-segment-button value="existing" content-id="existing">
        <ion-label>Existing</ion-label>
      </ion-segment-button>
      <ion-segment-button value="new" content-id="new">
        <ion-label>Create New</ion-label>
      </ion-segment-button>
    </ion-segment>


    <ion-segment-view class="mt-lg">
      <ion-segment-content id="existing">
        <app-category-existing
          [options]="['Aaaa', 'Bbbb']"
          [(value)]="currentCategory"
        />
        <p>currentCategory: {{ currentCategory() }}</p>
      </ion-segment-content>
      <ion-segment-content id="new">New Category</ion-segment-content>
    </ion-segment-view> -->

    <ion-segment 
      [value]="mode()"
      (ionChange)="onSegmentValueChange($event.detail.value)"
    >
      <ion-segment-button value="existing">
        <ion-label>Choose existing category</ion-label>
      </ion-segment-button>
      <ion-segment-button value="new">
        <ion-label>Create new category</ion-label>
      </ion-segment-button>
    </ion-segment>

    @if(mode() === 'existing') {
      <app-list>
        <ion-radio-group 
          [value]="existingCategory()"
          (ionChange)="onExistingCategoryChange($event.detail.value)">
          @for(category of categoriesInput(); track category) {
            <ion-item>
              <ion-radio [value]="category">{{ category }}</ion-radio>
            </ion-item>
          }
        </ion-radio-group>
      </app-list>
    }
    @else {
      <app-list>
        <ion-item>
          <ion-input
            [placeholder]="'Enter a category name'"
            [value]="newCategory() === null ? '' : newCategory()"
            (ionInput)="onNewCategoryChange($event.detail.value)"
          />
        </ion-item>
      </app-list>
    }

    <p>current category: {{ currentCategory() }}</p>

    
  `,
  styles: [``],
})
export class CategoryComponent {
  
  // currentCategory = signal<string | null>(null);
  

  categoriesInput = input.required<string[]>({alias: 'categories'})
  categoryInput = input.required<string | null>({alias: 'category'})

  mode = signal<'existing' | 'new'>('existing')
  existingCategory = linkedSignal<string | null>(() => this.categoryInput())
  newCategory = signal<string | null>(null)

  currentCategory = computed(() => {
    return {
      existing: () => this.existingCategory(),
      new: () => this.newCategory()
    }[this.mode()]()
  })

  onSegmentValueChange(e: any) {
    this.mode.set(e)
  }
  
  onExistingCategoryChange(e: any) {
    this.existingCategory.set(e)
  }

  onNewCategoryChange(e: any) {
    this.newCategory.set(e)
  }
  




  // DEPENDENCIES
  // STATE
  // SELECTORS
  // ACTIONS
  // PRIVATE
}
