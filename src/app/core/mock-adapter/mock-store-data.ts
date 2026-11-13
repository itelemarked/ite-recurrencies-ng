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
