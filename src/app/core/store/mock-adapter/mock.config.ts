/**
 * Seed data of the mock backend. Nothing here is ever modified: each MockDatabase
 * (see mock.utils.ts) works on its own deep copy.
 *
 * The bundle check (npm run check:bundle) searches the production build for the e-mail
 * address 'aaa@aaa.com' below. If you change that address, change the script too.
 */

export const MOCK_AUTH_DATA: Record<string, unknown> = {
  users: {
    'user-1': {
      email: 'aaa@aaa.com',
      password: '111111',
    },
    'user-2': {
      email: 'bbb@bbb.com',
      password: '222222',
    },
  },
};

export const MOCK_STORE_DATA: Record<string, unknown> = {
  users: {
    'user-1': {
      recurrencies: {
        'rec-101': {
          title: 'Aircraft EC Check',
          lastEvent: '2025-10-11',
          periodNb: 66,
          periodUnit: 'day',
          category: 'aircraft',
        },
        'rec-102': {
          title: 'Annual Medical Certificate',
          lastEvent: '2026-03-15',
          periodNb: 1,
          periodUnit: 'year',
          category: 'health',
        },
      },
      settings: {
        timezone: 'Europe/Zurich',
        dateFormat: 'CH_DATE_TIME',
      },
    },
    'user-2': {
      recurrencies: {
        'rec-201': {
          title: 'Car Oil Change',
          lastEvent: '2026-06-01',
          periodNb: 6,
          periodUnit: 'month',
          category: 'vehicle',
        },
        'rec-202': {
          title: 'Home Smoke Detector Test',
          lastEvent: '2026-09-20',
          periodNb: 3,
          periodUnit: 'month',
          category: 'home',
        },
      },
      settings: {
        timezone: 'Indian/Mauritius',
        dateFormat: 'ISO',
      },
    },
  },
};
