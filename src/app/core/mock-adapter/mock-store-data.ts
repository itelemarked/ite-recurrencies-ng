export interface MockStoreDatabase {
  users: Record<
    string,
    {
      recurrencies: Record<string, unknown>;
    }
  >;
}

export const MOCK_STORE_DATA: MockStoreDatabase = {
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
    },
  },
};
