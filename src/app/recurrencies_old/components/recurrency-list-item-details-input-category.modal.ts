import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, checkmarkSharp } from 'ionicons/icons';
import { ListComponent } from './app-list.component';



type InputData = {
  categories: string[],
  value: string | null
}

@Component({
  selector: 'app-recurrency-list-item-details-input-category',
  standalone: true,
  imports: [
    IonicModule,
    ListComponent
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

      <!-- <div class="m-lg">
        <ion-segment 
          [value]="state.displayMode()"
          (ionChange)="onSegmentValueChange($event)"
        >
          <ion-segment-button value="existing">
            <ion-label>Choose existing category</ion-label>
          </ion-segment-button>
          <ion-segment-button value="new">
            <ion-label>Create new category</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div> -->

      <app-list
        title="New category"
      >
        <ion-item>
          <ion-input 
            placeholder="Enter a category name"
            [clearInput]="true"
            (ionInput)="onInputChange($event)"
          >
            <!-- @if(inputValue() !== null) {
              <ion-icon slot="end" name="checkmark-sharp" color="primary"></ion-icon>
            } -->
            <ion-icon 
              slot="end" 
              name="checkmark-sharp"
              color="primary"
              [style.visibility]="inputCheckmarkVisibility()"
            />
          </ion-input>
        </ion-item>
      </app-list>

      <!-- @if(state.displayMode() === 'existing') { -->
        <app-list class="mt-xl" title="Existing categories">
          <ion-radio-group
            [value]="optionValue()"
            (ionChange)="onOptionChange($event)"
          >
          
            @for (category of filteredCategories(); track category) {
              <ion-item>
                <!-- <ion-button slot="start">
                  <ion-icon slot="icon-only" name="navigate"></ion-icon>
                </ion-button> -->
                <ion-radio [value]="category">
                  {{ category }}
                </ion-radio>
              </ion-item>
            }
          </ion-radio-group>
        </app-list>
      <!-- } -->

      <!-- @else {
        <app-list>
          <ion-item>
            <ion-input
              type="text"
              placeholder="Enter a category name"
              [value]="state.currentNew()"
              (ionInput)="onInputChange($event)"
            />
          </ion-item>
        </app-list>
      } -->

      <!-- <div>inputValue: {{ inputValue() === null ? 'null' : inputValue() }}</div> -->
      <!-- <div>optionValue: {{ optionValue() === null ? 'null' : optionValue() }}</div> -->
      <div>currentValue: {{ currentValue() === null ? 'null' : currentValue() }}</div>

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
  inputData = input.required<InputData>()

  currentValue = linkedSignal(() => this.inputData().value === null ? '' : this.inputData().value)
  filteredCategories = linkedSignal(() => this.inputData().categories)

  // SELECTORS
  optionValue = computed(() => this.currentValue())

  // inputValue = computed(() => {
  //   const currentValue = this.currentValue()
  //   const categories = this.inputData().categories
  //   return currentValue !== null && categories.includes(currentValue)
  //   || currentValue?.trim() === '' ? null : currentValue
  // })
  // optionValue = computed(() => {
  //   const currentValue = this.currentValue()
  //   const categories = this.inputData().categories
  //   return currentValue !== null && categories.includes(currentValue) ? currentValue : null
  // })

  // inputValue = computed(() => {
  //   const currentValue = this.currentValue()
  //   const categories = this.inputData().categories
  //   return currentValue !== null && categories.includes(currentValue)
  //   || currentValue?.trim() === '' ? null : currentValue
  // })
  
  // filteredCategories = computed(() => {
  //   const categories = this.inputData().categories
  //   const value = this.currentValue() ?? ''
  //   return categories.filter((category) => category.includes(value));
  // })

  // inputCheckmarkVisibility = computed(() => this.inputValue() !== null ? 'visible' : 'hidden')
  inputCheckmarkVisibility = computed(() => {
    const categories = this.inputData().categories
    const currentValue = this.currentValue()
    return currentValue !== null && categories.includes(currentValue) || currentValue === null ? 'hidden' : 'visible'
  })



  
  constructor() {
    addIcons({createOutline, checkmarkSharp})
  }
  // ACTIONS
  onBackButtonClick = () => {
    const ouptutData: string | null = this.currentValue()
    this.modalCtrl.dismiss(ouptutData)
  }

  onCancelClick = () => {
    const ouptutData: string | null = null
    this.modalCtrl.dismiss(ouptutData)
  }

  onOptionChange = (e: any) => {
    this.currentValue.set(e.detail.value)
    this.filteredCategories.set(this.inputData().categories)
  }

  onInputChange = (e: any) => {
    const val = e.detail.value.trim()
    this.currentValue.set(val)

    if(val === '') {
      this.filteredCategories.set(this.inputData().categories)
    } else {
      const categories = this.inputData().categories.filter(category => category.includes(val))
      this.filteredCategories.set(categories)
    }
  }

  // PRIVATE
}





// @Component({
//   selector: 'app-recurrency-list-item-details-input-category',
//   standalone: true,
//   imports: [
//     FormsModule,
//     IonHeader,
//     IonToolbar,
//     IonButtons,
//     IonButton,
//     IonIcon,
//     IonTitle,
//     IonContent,
//     IonList,
//     IonItem,
//     IonRadioGroup,
//     IonRadio,
//     FormField,
//     IonSearchbar,
//   ],
//   template: `
//     <ion-header collapse="fade" [translucent]="true">
//       <ion-toolbar>
//         <ion-buttons slot="start">
//           <ion-button (click)="onBackButtonClick()">
//             <ion-icon name="chevron-back-outline"></ion-icon>
//           </ion-button>
//         </ion-buttons>
//         <ion-title>Edit Category</ion-title>
//         <ion-buttons slot="end">
//           <ion-button (click)="onCancelClick()">Cancel</ion-button>
//         </ion-buttons>
//       </ion-toolbar>
//     </ion-header>
//     <ion-content [forceOverscroll]="false">
//       <ion-searchbar
//         [formField]="form.filterCtl" 
//       />

//       <ion-list class="with-list-header" [inset]="true">
//         <ion-radio-group
//           [formField]="form.categoryCtl" 
//         >
//           @for (category of filteredCategories(); track category) {
//             <ion-item>
//               <ion-radio [value]="category">
//                 {{ category }}
//               </ion-radio>
//             </ion-item>
//           }
//         </ion-radio-group>
//       </ion-list>
//       @if(filteredCategories().length === 0) {
//         <ion-button
//           class="mx-lg"
//           expand="block"
//           fill="outline"
//           (click)="onAddCategory(form.filterCtl().value())"
//         >
//           Add '{{ form.filterCtl().value() }}'
//         </ion-button>
//       }
//     </ion-content>
//   `,
//   styles: [`
//     ion-radio-group.ng-touched.ng-invalid ion-item {
//       --color: var(--ion-color-danger-tint);
//     }
//   `],
// })
// export class RecurrencyListItemDetailsInputCategoryComponent {
//   // DEPENDENCIES
//   private modalCtrl = inject(ModalController)

//   // STATE
//   categoryListInput = input.required<string[]>({ alias: 'categoryList' });
//   categoryInput = input.required<string | null>({ alias: 'category' });

//   private formModel = linkedSignal<{
//     filterCtl: string,
//     categoryCtl: string | null
//   }>(() => ({
//     filterCtl: '',
//     categoryCtl: this.categoryInput()
//   }))

//   form = form(this.formModel, (schema) => {
//     required(schema.categoryCtl, {message: 'Choose a category please.'})
//   })

//   state = {
//     categoryList: linkedSignal<string[]>(() => this.categoryListInput())
//   }

//   // SELECTORS
//   filteredCategories = computed(() =>
//     this.state.categoryList().filter((category) => category
//       .toLowerCase()
//       .includes(this.form.filterCtl().value().toLowerCase())),
//   );

//   // ACTIONS
//   onBackButtonClick = () => {
//     const category = this.form.categoryCtl().value()
//     if(category === null) {
//       this.form.categoryCtl().markAsTouched()
//     } else {
//       this.modalCtrl.dismiss(this.form.categoryCtl().value())
//     }
//   }

//   onCancelClick = () => {
//     this.modalCtrl.dismiss(this.categoryInput())
//   }

//   onAddCategory = (category: string) => {
//     this.state.categoryList.update(val => [category, ...val])
//     this.form.filterCtl().value.set('')
//     this.form.categoryCtl().value.set(category)
//   }

//   // PRIVATE
// }
