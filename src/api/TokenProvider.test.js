import TokenProvider from './TokenProvider.js';

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key];
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }
}

describe('TokenProvider', () => {
  it('should persist access token', () => {
    const mockLocalStorage = new LocalStorageMock();
    const tp = new TokenProvider({ storage: mockLocalStorage });
    tp.setToken({ accessToken: 123 });
    expect(mockLocalStorage.getItem('accessToken')).toBe(
      JSON.stringify({ accessToken: 123 })
    );
  });

  it('should load access token', () => {
    const mockLocalStorage = new LocalStorageMock();
    mockLocalStorage.setItem(
      'accessToken',
      JSON.stringify({ accessToken: 123 })
    );
    const tp = new TokenProvider({ storage: mockLocalStorage });
    expect(tp.getAccessToken()).toBe(123);
  });

  it('should works with createdAt', () => {
    const mockLocalStorage = new LocalStorageMock();
    mockLocalStorage.setItem(
      'accessToken',
      JSON.stringify({ accessToken: 123, expiresIn: 1233, createdAt: 888 })
    );
    const tp = new TokenProvider({ storage: mockLocalStorage });
    expect(tp.getAccessTokenObject()).toEqual({
      accessToken: 123,
      expiresIn: 1233,
      createdAt: 888
    });
  });

  it('isExpired', () => {
    const mockLocalStorage = new LocalStorageMock();
    mockLocalStorage.setItem(
      'accessToken',
      JSON.stringify({
        accessToken: 123,
        expiresIn: 3,
        createdAt: Math.round(
          new Date('Tue Jun 05 2018 15:11:54 GMT+0700 (+07)').getTime() / 1000
        )
      })
    );
    const tp = new TokenProvider({ storage: mockLocalStorage });
    expect(
      tp.isExpired(new Date('Tue Jun 05 2018 15:11:58 GMT+0700 (+07)'))
    ).toBeFalsy();
    expect(
      tp.isExpired(new Date('Tue Jun 05 2018 15:11:55 GMT+0700 (+07)'))
    ).toBeTruthy();
    tp.setToken({});
    expect(
      tp.isExpired(new Date('Tue Jun 05 2018 15:11:55 GMT+0700 (+07)'))
    ).toBeFalsy();
  });
});
