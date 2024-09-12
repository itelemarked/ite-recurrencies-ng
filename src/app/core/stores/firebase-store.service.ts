import { inject, Injectable, Signal, signal } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Observable, map, of, switchMap, tap } from "rxjs";
import { Recurrency } from "../../modules/recurrency/types/Recurrency.model";
import { PeriodUnit } from "../../modules/recurrency/types/PeriodUnit.type";
import { IStore } from "./store.interface";


@Injectable({providedIn: 'root'})
export class FirebaseStoreService implements IStore {

  constructor(private firestore: AngularFirestore) {}

  get$<T>(path: string): Observable<T | null> {
    switch (this._type(path)) {
      case 'coll': 
        return this._onCollChanges(path)
      case 'doc':
        return this._onDocChanges(path)
    }
  }

  set<T>(path: string, item: T): Promise<void> {
    switch (this._type(path)) {
      case 'coll': 
        // return this._setColl(path, item, idField)
        return this._setColl(path, item)
      case 'doc':
        return this._setDoc(path, item)
    }
  }

  delete<T>(path: string): Promise<void> {
    return this.firestore.doc<T>(path).delete()
  }

  private _type(path: string): 'coll' | 'doc' {
    const pathArr = path.split('/')
    if (pathArr.length % 2 === 0) return 'doc'
    return 'coll'
  }

  private _onDocChanges<T>(path: string): Observable<T | null> {
    return this.firestore.doc<Record<string, any>>(path).snapshotChanges().pipe(
      map(res => {
        const firebaseId = res.payload.id
        const data = res.payload.data()
        if (data === undefined) return null
        return { firebaseId, ...data } as unknown as T
      })
    )
  }

  private _onCollChanges<T>(path: string): Observable<T> {
    return this.firestore.collection<Record<string, any>>(path).snapshotChanges().pipe(
      map(r => r.map(res => {
        const firebaseId = res.payload.doc.id
        const data = res.payload.doc.data()
        if (data === undefined) return []
        return { firebaseId, ...data }
      }) as unknown as T)
    )
  }

  private _setDoc<T>(path: string, doc: T): Promise<void> {
    return this.firestore.doc<T>(path).set(doc)
  }

  private async _setColl<T>(path: string, item: T): Promise<void> {      
    await this.firestore.collection<T>(path).add(item)
    return
  }

}

