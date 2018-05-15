import _regeneratorRuntime from 'babel-runtime/regenerator';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Persistence token manage layer
var TokenProvider =

// private
function TokenProvider() {
  var _this = this;

  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$accessTokenKey = _ref.accessTokenKey,
      accessTokenKey = _ref$accessTokenKey === undefined ? 'accessToken' : _ref$accessTokenKey,
      _ref$refreshTokenKey = _ref.refreshTokenKey,
      refreshTokenKey = _ref$refreshTokenKey === undefined ? 'refreshToken' : _ref$refreshTokenKey;

  _classCallCheck(this, TokenProvider);

  this.hbAccessToken = null;
  this.accessToken = null;

  this.setToken = function (_ref2) {
    var accessToken = _ref2.accessToken,
        refreshToken = _ref2.refreshToken;

    _this.accessToken = accessToken;
    _this.refreshToken = refreshToken;
    localStorage.setItem(_this.accessTokenKey, accessToken);
    localStorage.setItem(_this.refreshTokenKey, refreshToken);
  };

  this.renewToken = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));

  this.getAccessToken = function () {
    return _this.accessToken;
  };

  this.hasAccessToken = function () {
    return !!_this.accessToken;
  };

  this.accessTokenKey = accessTokenKey;
  this.refreshTokenKey = refreshTokenKey;
  this.accessToken = localStorage.getItem(this.accessTokenKey);
  this.refreshToken = localStorage.getItem(this.refreshTokenKey);
}

// public

;

export default TokenProvider;