
// export const MOCK_DATAS: any = {
//   users: {
//     '0yuA0RLZFJdbRKtVSfW4y5HSQMq1': {
//       settings: {
//         timezone: 'Europe/Zurich',
//         dateFormat: 'CH'
//       },
//       recurrencies: {
//         xsxdjdsasddfs: {
//           title: 'EC',
//           lastEvent: '2025-12-31',
//           periodNb: 30,
//           periodUnit: 'days',
//           category: 'Aircrafts'
//         },
//         adjdioenssadfe: {
//           title: 'PU',
//           lastEvent: '2025-12-31',
//           periodNb: 27,
//           periodUnit: 'days',
//           category: 'Aircrafts'
//         },
//         adjfjjksksls: {
//           title: 'Sere Sea',
//           lastEvent: '2025-12-31',
//           periodNb: 1,
//           periodUnit: 'years',
//           category: 'Survival'
//         },
//       },
//     },
//   },
// }

import { isPlainObject } from "src/js/valid-type"

// localStorage.setItem('ite-recurrencies-ng-data', JSON.stringify(MOCK_DATAS))

export function store(name: string) {
  return {
    getData: getData(name)
  }
}

function getData(storeName: string) {
  return function(path?: string): unknown | null {
    const DATA_STRING: string | null = localStorage.getItem(storeName)
    if(DATA_STRING === null) return null
    
    const DATA = JSON.parse(DATA_STRING)
    if(path === undefined) return DATA
    if(!isPlainObject(DATA)) return null

    const allButLastKey = path.split('/').slice(0, -1)
    const lastKey = path.split('/').slice(-1)[0]
    
    const lastObj = allButLastKey.reduce(
      (acc: Record<string, any> | null, key: string) => {
        if(acc === null) return null
        if(!isPlainObject(acc)) return null
        if(!(key in acc)) return null
        return acc[key]
      },
      DATA
    )
    if(lastObj === null) return null
    return lastObj[lastKey] === undefined ? null : lastObj[lastKey]
  }
}











// const mockData$ = new BehaviorSubject<any>(MOCK_DATAS)

// mockData$.subscribe(val => {
//   console.log('MOCK_DATAS changed')
//   console.log(val)
// })

// export function get<T>(path: string): T | null {
//   let currentObj = MOCK_DATAS
//   path.split('/').forEach((el) => {
//     currentObj = currentObj?.[el] 
//   })
//   return currentObj === undefined ? null : currentObj
// }


// export function get$<T>(path: string): Observable<T | null> {
//   return mockData$.pipe(
//     map(data => {
//       let currentObj = data
//       path.split('/').forEach((el) => {
//         currentObj = currentObj?.[el] 
//       })
//       return currentObj === undefined ? null : currentObj
//     }),
//     delay(300)
//   )
// }

// export function getList<T>(path: string, idField: string): (T & {[idField]: string})[] {
//   return [
//     {
//       someField: 'a',
//       [idField]: 'abcd'
//     }
//   ]
// }


// export function set<T>(path: string, value: T) {
//   let currentObj = MOCK_DATAS
//   path.split('/').forEach((el, idx, arr) => {
//     if(idx === arr.length-1) {
//       currentObj[el] = value
//     } 
//     if(currentObj[el] === undefined) {
//       currentObj[el] = {}
//     }
//     currentObj = currentObj[el]
//   })
//   mockData$.next(MOCK_DATAS)
//   return Promise.resolve()
// }


// export function remove(path: string) {
//   const pathArray = path.split('/')
//   const propToRemove = pathArray.pop()!
//   const newPath = pathArray.join('/')

//   const obj: any = get(newPath)
//   if(obj !== null) {
//     delete obj[propToRemove]
//   }
//   mockData$.next(MOCK_DATAS)
//   return Promise.resolve()
// }
