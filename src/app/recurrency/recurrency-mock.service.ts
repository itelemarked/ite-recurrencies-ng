import { IRecurrency, IRecurrencyData } from "../_interfaces/IRecurrency"
import { IUser } from "../_interfaces/IUser"

const USERS: {
  [key:string]: IUser
} = {
  'u1': {
    id: 'u1',
    email: 'u1@u1.com'
  },
  'u2': {
    id: 'u2',
    email: 'u2@u2.com'
  },
}

const DATAS: {
  users: {
    [key:string]: {
      recurrencies: {
        [key:string]: IRecurrencyData
      }
    }
  }
} = {
  users: {
    'u1': {
      recurrencies: {
        'u1-r1': {
          id: 'u1-r1',
          title: 'u1-r1',
          lastEvent: '2001-01-01',
          periodNb: 99,
          periodUnit: 'days'
        },
        'u1-r2': {
          id: 'u1-r2',
          title: 'u1-r2',
          lastEvent: '2001-01-02',
          periodNb: 99,
          periodUnit: 'days'
        },
      }
    },
    'u2': {
      recurrencies: {
        'u2-r1': {
          id: 'u2-r1',
          title: 'u2-r1',
          lastEvent: '2001-02-01',
          periodNb: 99,
          periodUnit: 'days'
        },
        'u2-r2': {
          id: 'u2-r2',
          title: 'u2-r2',
          lastEvent: '2001-02-02',
          periodNb: 99,
          periodUnit: 'days'
        },
      }
    },
  }
}
  

