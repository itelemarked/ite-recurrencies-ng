import { DateString, isDateString } from "../types/DateString"
import { isPeriodUnit, PeriodUnit } from "../types/PeriodUnit"
import { isPositiveInteger, PositiveInteger } from "../types/PositiveInteger"
import { Recurrency } from "../types/Recurrency"
import { TimeString } from "../types/TimeString"
import { TimezoneString } from "../types/TimezoneString"
import { createTimezoneDate } from "../utils/date/date.utils"

export let DATA: any = {
  users: {
    'usr-aaa': {
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

const isRecurrencyData = (val: unknown): val is RecurrencyData => {
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

const resolveDelayed = (val?: any, DELAY = 500): Promise<any> => {
  return new Promise(resolve => setTimeout(() => resolve(val), DELAY))
}

function get<ExpectedData>(path: string): Promise<ExpectedData | undefined> {
  const ref = path.split('/').reduce( (acc, item) => {
    return acc?.[item]
  }, DATA)
  return resolveDelayed(ref)
}

function put(path: string, data: any): Promise<'added' | 'modified'> {
  let action: 'added' | 'modified'

  path.split('/').reduce( (acc, item, idx, arr) => {
    if(idx !== arr.length - 1) {
      if(acc[item] === undefined) acc[item] = {}
      return acc[item]
    }

    acc[item] === undefined ? action = 'added' : action = 'modified'
    acc[item] = data
    return acc[item]
  }, DATA)
  
  return resolveDelayed(action!)
}


// TODO: move to recurrency.service
async function fetchRecurrencies(userId: string) {
  const datas = await get<RecurrencyData>(`users/${userId}/recurrencies`)

  if(datas === undefined) {
    return undefined
  }

  if(!isRecurrencyData(datas)) {
    throw new Error(`Datas is not typed as expected... not complying to 'RecurrencyData' interface!`)
  }

  const fromData = (data: RecurrencyData, timezone: TimezoneString): Recurrency[]  => {
    return Object.entries(data).map( ([id, data]) => ({
      id,
      title: data.title,
      lastEvent: createTimezoneDate({dateString: data.lastEvent, timeString: '23:59:59.999' as TimeString, timezone}),
      periodNb: data.periodNb,
      periodUnit: data.periodUnit
    }))
  }

  return fromData(datas, 'Europe/Zurich')
}


export function TEST() {
  // console.log(STORE.users['usr-aaa'].recurrencies)
  // isRecurrencyDataObject(STORE.users['usr-aaa'].recurrencies)
  // fetchRecurrencies('usr-aaa', 'Europe/Zurich').then(console.log)
  // fetchRecurrencies('usr-aaa').then(res => console.log(res))
  put('users/usr-aaa/recurrencies/rec-1', {'rec1': 'some-data'}).then(res => console.log(DATA))
  
}




