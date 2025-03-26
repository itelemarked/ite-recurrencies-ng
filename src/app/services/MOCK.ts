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

const MOCK_DATA: any = {

  AUTH: {
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
  },

  STORE: {
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
}

export async function TEST() {
  console.log(await get('AUTH', 0))
  const result = await put('AUTH/registeredUserssss', 'usr-aaa')
  console.log(result)
  console.log(await get('AUTH'))
}


function get(path: string, DELAY = 500): Promise<unknown> {
  const value = path.split('/').reduce((acc, item) => acc?.[item], MOCK_DATA)
  return resolveDelayed(value, DELAY)
}

// TODO: type of return value from promise? {request: put/post/delete, action: 'added'|'modified'|'deleted', path: string, value: any}??
function put(path: string, data: any, DELAY = 500): Promise<unknown> {
  const ref = path.split('/')
  // let action: 'added' | 'modified'

  path.split('/').reduce( (acc, item, idx, arr) => {
    if(idx !== arr.length - 1) {
      if(acc[item] === undefined) acc[item] = {}
    } else {
      acc[item] = data
    }
    return acc[item]
  }, MOCK_DATA)

  return resolveDelayed(data, DELAY)  
}

// TODO: type of return value from promise? {request: put/post/delete, action: 'added'|'modified'|'deleted', path: string, value: any}??
function post<T>(path: string, data: T, DELAY = 500): Promise<Record<string, T>> {
  const ref = path.split('/')
  // let action: 'added' | 'modified'

  const uid = 'posted-' + Math.round(Math.random() * 1000000000).toString()
  const newRef = path.split('/').reduce( (acc, item, idx, arr) => {
    if(acc[item] === undefined) acc[item] = {}
    return acc[item]
  }, MOCK_DATA)
  newRef[uid] = data

  return resolveDelayed({[uid]: data}, DELAY)  
}

// TODO: type of return value from promise? {request: put/post/delete, action: 'added'|'modified'|'deleted', path: string, value: any}??
function deleteFn(path: string, refId: string, DELAY = 5000): Promise<Record<string, any> | undefined> {
  const ref = path.split('/').reduce((acc, item) => acc?.[item], MOCK_DATA)
  if(ref !== undefined) {
    const itemToDelete = {[refId]: ref[refId]}
    delete ref[refId]
    return resolveDelayed(itemToDelete, DELAY)
  }
  return resolveDelayed(undefined, DELAY)
}


export const mockHttp = {
  get,
  put,
  post,
  delete: deleteFn
}





