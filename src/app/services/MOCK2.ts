import { DateString, isDateString } from "../types/DateString"
import { isPeriodUnit, PeriodUnit } from "../types/PeriodUnit"
import { isPositiveInteger, PositiveInteger } from "../types/PositiveInteger"




/*************  UTILS **************/
const resolveDelayed = (val?: any, DELAY = 500): Promise<any> => {
  return new Promise(resolve => setTimeout(() => resolve(val), DELAY))
}

const rejectDelayed = (err: any, DELAY = 500): Promise<any> => {
  return new Promise( (resolve, reject) => setTimeout(() => reject(err), DELAY))
}



/*************  AUTH **************/

const AUTH: any = {
  currentUser: null,
  registeredUsers: {
    'usr-aaa': {
      email: 'aaa@aaa.com',
      password: '111111',
    },
    'usr-bbb': {
      email: 'bbb@bbb.com',
      password: '222222'
    }
  }
}

type ExpectedAuth = {
  currentUser: UserData | null,
  registeredUsers: RegisteredUsersData
}

type UserData = { uid: string, email: string }

const isUserData = (val: unknown): val is UserData => {
  return val !== null
    && typeof val === 'object'
    && 'email' in val
    && 'uid' in val
    && typeof val.email === 'string'
    && typeof val.uid === 'string'
}

type RegisteredUsersData = Record<string, {email: string, password: string}>

const isRegisteredUsersData = (val: unknown): val is RegisteredUsersData => {
  return val !== undefined
    && val !== null
    && Object.getPrototypeOf(val) === Object.prototype
    && Object.values(val as Record<string, unknown>).every(v => {
      return v !== null 
        && typeof v === 'object' 
        && 'email' in v
        && 'password' in v
        && typeof v.email === 'string'
        && typeof v.password === 'string'
    })
}

function getAuth(path: string) {
  const ref = path.split('/')
  return ref.reduce((acc, item) => {
    return acc?.[item]
  }, AUTH)
}


function postAuth(path: string, data: any) {
  
}

// export function getUser<ExpectedData>(email: string, password: string): Promise<ExpectedData | undefined> {
//   const ref = AUTH?.registeredUsers

//   if(!isRegisteredUsersData(ref)) {
//     return resolveDelayed(undefined)
//   }

//   const foundMatchingEmailAndPassword = Object.entries(ref)
//     .find( ([uid, data]) => email === data.email && password === data.password)

//   if(foundMatchingEmailAndPassword === undefined) {
//     return resolveDelayed(undefined)
//   }

//   const [uid, data] = foundMatchingEmailAndPassword
//   return resolveDelayed({uid, email: data.email})
// }


// export function postUser(email: string, password: string): Promise<{uid: string, email: string} | undefined> {
//   const ref = AUTH?.registeredUsers

//   if(!isRegisteredUsersData(ref)) {
//     console.warn(`Data is not as expected... expected: '[key: string]: { email: string, password: string }'`)
//     return resolveDelayed(undefined)
//   }

//   const emailAlreadyExists = Object.entries(ref)
//     .find( ([uid, data]) => email === data.email)

//   if(emailAlreadyExists) {
//     return rejectDelayed(`Email already exists`)
//   }

//   const uid = 'usr-' + Math.round(Math.random() * 100000000000).toString()

//   AUTH['registeredUsers'][uid] = {email, password}
//   AUTH['currentUser'] = {uid, email}
//   console.log(AUTH)

//   return resolveDelayed({uid, email})
// }


/*************  STORE **************/
let STORE: any = {
  users: {
    'usr-aaa': {
      settings: {
        timezone: 'Europe/Zurich'
      },
      recurrencies: {
        'rec-1': {
          title: 'USER A, REC 1',
          lastEvent: '2024-07-01',
          periodNb: 31,
          periodUnit: 'days'
        },
        'rec-2': {
          title: 'USER A, REC 2',
          lastEvent: '2024-09-01',
          periodNb: 31,
          periodUnit: 'days'
        },
      }
    },
    'usr-bbb': {
      settings: {
        timezone: 'Indian/Mauritius'
      },
      recurrencies: {
        'rec-1': {
          title: 'USER B, REC 1',
          lastEvent: '2025-07-01',
          periodNb: 31,
          periodUnit: 'days'
        },
        'rec-2': {
          title: 'USER B, REC 2',
          lastEvent: '2025-09-01',
          periodNb: 31,
          periodUnit: 'days'
        },
      }
    }
  }
}


type ExpectedDatas = {
  users: {
    [key: string]: {
      recurrencies: {
        [key: string]: {
          title: string,
          lastEvent: DateString,
          periodNb: PositiveInteger,
          periodUnit: PeriodUnit
        }
      }
    }
  }
}

type RecurrencyData = ExpectedDatas['users']['userId']['recurrencies']

export const isRecurrencyData = (val: unknown): val is RecurrencyData => {
  const isString = (v: unknown): v is string => typeof v === 'string'

  return val !== null
    && typeof val === 'object'
    && Object.values(val).every(v => {
      return isString(v.title)
        && isDateString(v.lastEvent)
        && isPositiveInteger(v.periodNb)
        && isPeriodUnit(v.periodUnit)
    })
}

export function getData<ExpectedData>(path: string): Promise<ExpectedData | undefined> {
  const ref = path.split('/').reduce( (acc, item) => {
    return acc?.[item]
  }, STORE)
  return resolveDelayed(ref)
}

export function putData(path: string, data: any): Promise<'added' | 'modified'> {
  let action: 'added' | 'modified'

  path.split('/').reduce( (acc, item, idx, arr) => {
    if(idx !== arr.length - 1) {
      if(acc[item] === undefined) acc[item] = {}
      return acc[item]
    }

    acc[item] === undefined ? action = 'added' : action = 'modified'
    acc[item] = data
    return acc[item]
  }, STORE)
  
  return resolveDelayed(action!)
}









// TODO: move to recurrency.service
// async function fetchRecurrencies(userId: string) {
//   const datas = await getData<RecurrencyData>(`users/${userId}/recurrencies`)

//   if(datas === undefined) {
//     return undefined
//   }

//   if(!isRecurrencyData(datas)) {
//     throw new Error(`Datas is not typed as expected... not complying to 'RecurrencyData' interface!`)
//   }

//   const fromData = (data: RecurrencyData, timezone: TimezoneString): Recurrency[]  => {
//     return Object.entries(data).map( ([id, data]) => ({
//       id,
//       title: data.title,
//       lastEvent: createTimezoneDate({dateString: data.lastEvent, timeString: '23:59:59.999' as TimeString, timezone}),
//       periodNb: data.periodNb,
//       periodUnit: data.periodUnit
//     }))
//   }

//   return fromData(datas, 'Europe/Zurich')
// }


export function TEST() {
  // console.log(STORE.users['usr-aaa'].recurrencies)
  // isRecurrencyDataObject(STORE.users['usr-aaa'].recurrencies)
  // fetchRecurrencies('usr-aaa', 'Europe/Zurich').then(console.log)
  // fetchRecurrencies('usr-aaa').then(res => console.log(res))
  // putData('users/usr-aaa/recurrencies/rec-1', {'rec1': 'some-data'}).then(res => console.log(DATA))
  // getUser('bbb@bbb.com', '222222').then(console.log)
  console.log(getAuth('registeredUsers/usr-aaa/email'))
}




