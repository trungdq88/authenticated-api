import _regeneratorRuntime from 'babel-runtime/regenerator';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_OPTIONS = {
  bodyPreprocessor: JSON.stringify,
  headers: { 'Content-Type': 'application/json' }
};

var Api = function Api(_ref) {
  var _this = this;

  var tokenProvider = _ref.tokenProvider,
      prefix = _ref.prefix,
      fetcher = _ref.fetcher,
      logging = _ref.logging;

  _classCallCheck(this, Api);

  this.UNAUTHORIZED = 401;
  this.tokenProvider = null;
  this.prefix = null;

  this.get = function (url) {
    return _this._send(url, { method: 'GET' });
  };

  this.post = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return method.apply(undefined, ['POST'].concat(args));
  };

  this.put = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return method.apply(undefined, ['PUT'].concat(args));
  };

  this.patch = function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return method.apply(undefined, ['PATCH'].concat(args));
  };

  this.delete = function () {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return method.apply(undefined, ['DELETE'].concat(args));
  };

  this.method = function (method, url, body, options) {
    var _DEFAULT_OPTIONS$opti = Object.assign({}, DEFAULT_OPTIONS, options, {
      headers: Object.assign({}, DEFAULT_OPTIONS.headers, options.headers)
    }),
        bodyPreprocessor = _DEFAULT_OPTIONS$opti.bodyPreprocessor,
        headers = _DEFAULT_OPTIONS$opti.headers;

    return _this._send(url, {
      method: method,
      body: bodyPreprocessor ? bodyPreprocessor(body) : body,
      headers: headers
    });
  };

  this._send = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', _this._sendWithRetry(function () {
              return _this._authenticatedFetch.apply(_this, _toConsumableArray(args));
            }));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));

  this._sendWithRetry = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(sendRequest) {
      var firstTry, isFirstTrySuccess, secondTry;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              firstTry = sendRequest();
              _context2.next = 3;
              return firstTry.then(function (r) {
                return r.status;
              });

            case 3:
              isFirstTrySuccess = _context2.sent;

              if (!(isFirstTrySuccess !== _this.UNAUTHORIZED)) {
                _context2.next = 6;
                break;
              }

              return _context2.abrupt('return', firstTry);

            case 6:
              _this._log('Trying to renew access token...');
              _context2.next = 9;
              return _this.tokenProvider.renewToken();

            case 9:
              _this._log('Retrying...');
              secondTry = sendRequest();

              secondTry.then(function (r) {
                if (r.status === _this.UNAUTHORIZED) {
                  _this._log('Cannot renew token', r);
                }
              });
              return _context2.abrupt('return', secondTry);

            case 13:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }));

    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }();

  this._authenticatedFetch = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(url, options) {
      var headers;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              headers = Object.assign({
                authorization: 'Bearer ' + _this.tokenProvider.getAccessToken()
              }, options.headers);
              return _context3.abrupt('return', _this.fetcher(_this.prefix + url, Object.assign({}, options, {
                headers: headers
              })));

            case 2:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this);
    }));

    return function (_x2, _x3) {
      return _ref4.apply(this, arguments);
    };
  }();

  this._log = function () {
    var _console;

    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    return _this.logging && (_console = console).log.apply(_console, ['[API] '].concat(args));
  };

  this.tokenProvider = tokenProvider;
  this.prefix = prefix;
  this.fetcher = fetcher || function () {
    return fetch.apply(undefined, arguments);
  };
  this.logging = logging || false;
}

// public

// private

;

export default Api;