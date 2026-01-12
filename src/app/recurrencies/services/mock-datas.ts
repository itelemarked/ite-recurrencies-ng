import { BehaviorSubject, delay, distinctUntilChanged, map, Observable } from "rxjs"

export const MOCK_DATAS: any = {
  users: {
    '0yuA0RLZFJdbRKtVSfW4y5HSQMq1': {
      settings: {
        timezone: 'Europe/Zurich',
        dateFormat: 'CH'
      },
      recurrencies: {
        xsxdjdsasddfs: {
          title: 'EC',
          lastEvent: '2025-12-31',
          periodNb: 30,
          periodUnit: 'days',
          category: 'Aircrafts'
        },
        adjdioenssadfe: {
          title: 'PU',
          lastEvent: '2025-12-31',
          periodNb: 27,
          periodUnit: 'days',
          category: 'Aircrafts'
        },
        adjfjjksksls: {
          title: 'Sere Sea',
          lastEvent: '2025-12-31',
          periodNb: 1,
          periodUnit: 'years',
          category: 'Survival'
        },
      },
    },
  },
}

const mockData$ = new BehaviorSubject<any>(MOCK_DATAS)

// mockData$.subscribe(val => {
//   console.log('MOCK_DATAS changed')
//   console.log(val)
// })

export function get<T>(path: string): T | null {
  let currentObj = MOCK_DATAS
  path.split('/').forEach((el) => {
    currentObj = currentObj?.[el] 
  })
  return currentObj === undefined ? null : currentObj
}


export function get$<T>(path: string): Observable<T | null> {
  return mockData$.pipe(
    map(data => {
      let currentObj = data
      path.split('/').forEach((el) => {
        currentObj = currentObj?.[el] 
      })
      return currentObj === undefined ? null : currentObj
    }),
    delay(300)
  )
}


export function set<T>(path: string, value: T) {
  let currentObj = MOCK_DATAS
  path.split('/').forEach((el, idx, arr) => {
    if(idx === arr.length-1) {
      currentObj[el] = value
    } 
    if(currentObj[el] === undefined) {
      currentObj[el] = {}
    }
    currentObj = currentObj[el]
  })
  mockData$.next(MOCK_DATAS)
  return Promise.resolve()
}


export function remove(path: string) {
  const pathArray = path.split('/')
  const propToRemove = pathArray.pop()!
  const newPath = pathArray.join('/')

  const obj: any = get(newPath)
  if(obj !== null) {
    delete obj[propToRemove]
  }
  mockData$.next(MOCK_DATAS)
  return Promise.resolve()
}
