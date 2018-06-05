var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import TokenProvider from './TokenProvider.js';

var LocalStorageMock = function () {
  function LocalStorageMock() {
    _classCallCheck(this, LocalStorageMock);

    this.store = {};
  }

  _createClass(LocalStorageMock, [{
    key: 'clear',
    value: function clear() {
      this.store = {};
    }
  }, {
    key: 'getItem',
    value: function getItem(key) {
      return this.store[key];
    }
  }, {
    key: 'setItem',
    value: function setItem(key, value) {
      this.store[key] = value.toString();
    }
  }]);

  return LocalStorageMock;
}();

describe('TokenProvider', function () {
  it('should persist access token', function () {
    var mockLocalStorage = new LocalStorageMock();
    var tp = new TokenProvider({ storage: mockLocalStorage });
    tp.setToken({ accessToken: 123 });
    expect(mockLocalStorage.getItem('accessToken')).toBe(JSON.stringify({ accessToken: 123 }));
  });

  it('should load access token', function () {
    var mockLocalStorage = new LocalStorageMock();
    mockLocalStorage.setItem('accessToken', JSON.stringify({ accessToken: 123 }));
    var tp = new TokenProvider({ storage: mockLocalStorage });
    expect(tp.getAccessToken()).toBe(123);
  });

  it('should works with createdAt', function () {
    var mockLocalStorage = new LocalStorageMock();
    mockLocalStorage.setItem('accessToken', JSON.stringify({ accessToken: 123, expiresIn: 1233, createdAt: 888 }));
    var tp = new TokenProvider({ storage: mockLocalStorage });
    expect(tp.getAccessTokenObject()).toEqual({
      accessToken: 123,
      expiresIn: 1233,
      createdAt: 888
    });
  });

  it('isExpired', function () {
    var mockLocalStorage = new LocalStorageMock();
    mockLocalStorage.setItem('accessToken', JSON.stringify({
      accessToken: 123,
      expiresIn: 3,
      createdAt: Math.round(new Date('Tue Jun 05 2018 15:11:54 GMT+0700 (+07)').getTime() / 1000)
    }));
    var tp = new TokenProvider({ storage: mockLocalStorage });
    expect(tp.isExpired(new Date('Tue Jun 05 2018 15:11:58 GMT+0700 (+07)'))).toBeTruthy();
    expect(tp.isExpired(new Date('Tue Jun 05 2018 15:11:55 GMT+0700 (+07)'))).toBeFalsy();
    tp.setToken({});
    expect(tp.isExpired(new Date('Tue Jun 05 2018 15:11:55 GMT+0700 (+07)'))).toBeFalsy();
  });
});