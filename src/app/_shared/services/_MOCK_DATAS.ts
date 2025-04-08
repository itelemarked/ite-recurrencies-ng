

export const AUTH = {
  // currentUser: null,  // null | { uid: string, email: string }
  currentUser: {uid: 'usr-aaa', email: 'aaa@aaa.com'},
  users: {
    'usr-aaa': {
      email: 'aaa@aaa.com',
      password: '111111'
    },
    'usr-bbb': {
      email: 'bbb@bbb.com',
      password: '222222'
    }
  }
}


export const STORE: any = {
  users: {
    'usr-aaa': {
      settings: {
        timezone: 'Indian/Mauritius'
      },
      recurrencies: {
        'a-rec1': {
          title: 'Recurrency 1, user A',
          lastEvent: '2024-06-01',
          periodNb: 20,
          periodUnit: 'days'
        },
        'a-rec2': {
          title: 'Recurrency 2, user A',
          lastEvent: '2024-08-01',
          periodNb: 30,
          periodUnit: 'days'
        }
      },
    },

    'usr-bbb': {
      settings: {
        timezone: 'Europe/Zurich'
      },
      recurrencies: {
        'b-rec1': {
          title: 'Recurrency 1, user B',
          lastEvent: '2025-06-01',
          periodNb: 20,
          periodUnit: 'days'
        },
        'b-rec2': {
          title: 'Recurrency 2, user B',
          lastEvent: '2025-08-01',
          periodNb: 30,
          periodUnit: 'days'
        }
      }
    },
  }
}



type RecurrencyData = { title: string }
const isRecurrencyData = (val: any): val is RecurrencyData => {
  return val !== undefined 
    && val !== null
    && Object.getPrototypeOf(val) === Object.prototype
    && typeof val?.title === 'string'
}

type Recurrency = { id: string, title: string }

const isPlainObject = (val: unknown): val is Record<string, unknown> => val !== undefined && val !== null && Object.getPrototypeOf(val) === Object.prototype




// const fromDatas = (val: RecurrencyDatas | undefined) => val === undefined ? undefined : Object.entries(val).map( ([id, datas]) => ({id, ...datas}))
 
 
// const toDatas = (val: Recurrency[]): RecurrencyDatas => {
//     return val.reduce( (prev, {id, ...datas}) => ( {...prev, [id]: {...datas}} ), {} )
// }
 
function fetchRecurrencies(userId: string, DELAY = 300): Promise<Recurrency[] | undefined> {
    const recurrenciesData = STORE?.users?.[userId]?.recurrencies
    if (!isPlainObject(recurrenciesData)) return Promise.resolve(undefined)

    const isRecurrencyDataObject = (val: Record<string, unknown>): val is Record<string, RecurrencyData> => Object.values(val).every(v => isRecurrencyData(v))
    
    if(!isRecurrencyDataObject(recurrenciesData)) {
      return Promise.resolve(undefined)
    }

    const recurrencies = Object.entries(recurrenciesData).map( ([id, datas]) => ({id, ...datas}))
               
    return new Promise(resolve => setTimeout(() => resolve(recurrencies), DELAY))
}
 
// function saveRecurrencies(userId: string, recurrencies: Recurrency[], DELAY = 300): Promise<void> {
//     const recurrencyDatas = toDatas(recurrencies)
//     MOCK.users[userId].recurrencies = recurrencyDatas
               
//     return new Promise(resolve => setTimeout(() => resolve(), DELAY))
// }
 
// function saveRecurrency(userId: string, recurrency: Recurrency, DELAY = 300): Promise<void> {
//     const recurrencyData = toDatas(recurrency)
//     MOCK.users[userId].recurrencies = recurrencyDatas
               
//     return new Promise(resolve => setTimeout(() => resolve(), DELAY))
// }











// function fetchSettings(userId: string): Promise<{ timezone: string } | undefined> {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve(STORE.users[userId]?.settings)
//     }, 500);
//   })
// }

// // function fetchRecurrencies(userId: string): Promise<{id: string, title: string, lastEvent: string, periodNb: number, periodUnit: string} | undefined> {
// function fetchRecurrencies(userId: string): Promise<any | undefined> {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       const recurrencies = Object.entries(STORE.users[userId]?.recurrencies)
//       if(recurrencies === undefined) return undefined
//       return resolve(recurrencies.map(([id, data]) => ({id, ...data})))
//     }, 500);
//   })
// }