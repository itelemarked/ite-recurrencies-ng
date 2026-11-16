import { Injectable } from "@angular/core";
import { StoreCollectionPath, StoreValidator } from "./store.types";



// export function resolveCollectionPath(path: StoreCollectionPath): string | null {
//   switch(path) {
//     case 'recurrencies': {
//       return (user: AuthUser) => (user ? `users/${user.uid}/recurrencies` : null)
//     }

//   }
// }


@Injectable({providedIn: 'root'})
export class Store<T> {

  // collection<T>(path: CollectionStorePath, validator: StoreValidator<T>): CollectionStore {

  //   const items = watchItems(resolveCollectionPath(path))

  //   return {
  //     items,
  //     isLoading,
  //     error,
  //     addItem,
  //     updateItem,
  //     setItem,
  //     deleteItem
  //   }
  // }

  // document<T>(path: DocumentStorePath, validator: StoreValidator<T>): DocumentStore {}

}