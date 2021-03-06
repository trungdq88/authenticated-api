import _regeneratorRuntime from 'babel-runtime/regenerator';

var _this2 = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import Api from './Api.js';

describe('Api', function () {
  var fakeAccessToken = Math.random();
  var renewToken = Math.random();

  var MockTokenProvider = function MockTokenProvider() {
    var _this = this;

    _classCallCheck(this, MockTokenProvider);

    this.renewed = false;
    this.renewToken = jest.fn().mockImplementation(function () {
      return _this.renewed = true;
    });
    this.getAccessToken = jest.fn().mockImplementation(function () {
      return _this.renewed ? renewToken : fakeAccessToken;
    });
  };

  var fakePrefix = 'http://' + Math.random();
  var fakeBody = Math.random();

  it('should return what fetch returns', _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
    var mockTokenProvider, mockFetch, api, response;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mockTokenProvider = new MockTokenProvider();
            mockFetch = jest.fn().mockImplementation(function () {
              return { status: 200, body: fakeBody };
            });
            api = new Api({
              tokenProvider: mockTokenProvider,
              prefix: fakePrefix,
              fetcher: mockFetch
            });
            _context.next = 5;
            return api.get('/hello');

          case 5:
            response = _context.sent;

            expect(response).toEqual({ status: 200, body: fakeBody });

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this2);
  })));

  it('should prepend prefix', _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
    var mockTokenProvider, mockFetch, api;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            mockTokenProvider = new MockTokenProvider();
            mockFetch = jest.fn().mockImplementation(function () {
              return { status: 200 };
            });
            api = new Api({
              tokenProvider: mockTokenProvider,
              prefix: fakePrefix,
              fetcher: mockFetch
            });
            _context2.next = 5;
            return api.get('/hello');

          case 5:
            expect(mockFetch).toBeCalledWith(fakePrefix + '/hello', expect.anything());

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this2);
  })));

  it('should call fetch with authentication header', _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
    var mockTokenProvider, mockFetch, api;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            mockTokenProvider = new MockTokenProvider();
            mockFetch = jest.fn().mockImplementation(function () {
              return { status: 200 };
            });
            api = new Api({
              tokenProvider: mockTokenProvider,
              prefix: fakePrefix,
              fetcher: mockFetch
            });
            _context3.next = 5;
            return api.get('/hello');

          case 5:
            expect(mockFetch).toBeCalledWith(fakePrefix + '/hello', {
              headers: {
                authorization: 'Bearer ' + fakeAccessToken
              },
              method: 'GET'
            });

          case 6:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, _this2);
  })));

  it('should retry if failed', _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
    var mockTokenProvider, mockFetch, api;
    return _regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            mockTokenProvider = new MockTokenProvider();
            mockFetch = jest.fn().mockImplementation(function () {
              return { status: 401 };
            });
            api = new Api({
              tokenProvider: mockTokenProvider,
              prefix: fakePrefix,
              fetcher: mockFetch
            });
            _context4.next = 5;
            return api.get('/hello');

          case 5:
            expect(mockTokenProvider.renewToken).toBeCalledWith();
            expect(mockFetch).toHaveBeenCalledTimes(2);
            expect(mockFetch.mock.calls[1][1].headers.authorization).toEqual('Bearer ' + renewToken);

          case 8:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, _this2);
  })));

  it('should remove undefined headers', _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5() {
    var mockTokenProvider, mockFetch, api;
    return _regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            mockTokenProvider = new MockTokenProvider();
            mockFetch = jest.fn().mockImplementation(function () {
              return { status: 200 };
            });
            api = new Api({
              tokenProvider: mockTokenProvider,
              prefix: fakePrefix,
              fetcher: mockFetch
            });
            _context5.next = 5;
            return api.post('/hello', {}, { headers: { a: 1, b: undefined } });

          case 5:
            expect(mockFetch.mock.calls[0][1].headers).toEqual({
              'Content-Type': 'application/json',
              a: 1,
              authorization: 'Bearer ' + fakeAccessToken
            });

          case 6:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, _this2);
  })));
});