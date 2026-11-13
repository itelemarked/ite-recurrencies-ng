export interface MockAuthEntry {
  email: string;
  password: string;
}

export interface MockAuthDatabase {
  users: Record<string, MockAuthEntry>;
}

export const MOCK_AUTH_DATA: MockAuthDatabase = {
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