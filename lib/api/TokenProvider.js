import _regeneratorRuntime from 'babel-runtime/regenerator';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Persistence token manage layer
var KEY = 'accessToken';

var TokenProvider =

// private
function TokenProvider() {
  var _this = this;

  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$storage = _ref.storage,
      storage = _ref$storage === undefined ? window.localStorage : _ref$storage,
      _ref$key = _ref.key,
      key = _ref$key === undefined ? KEY : _ref$key;

  _classCallCheck(this, TokenProvider);

  this.data = null;

  this.setToken = function (_ref2) {
    var accessToken = _ref2.accessToken,
        refreshToken = _ref2.refreshToken,
        expiresIn = _ref2.expiresIn,
        createdAt = _ref2.createdAt;

    _this.data = { accessToken: accessToken, refreshToken: refreshToken, expiresIn: expiresIn, createdAt: createdAt };
    _this.storage.setItem(_this.key, JSON.stringify(_this.data));
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
    return _this.data && _this.data.accessToken;
  };

  this.getAccessTokenExpiration = function () {
    return _this.data && _this.data.expiresIn;
  };

  this.getAccessTokenCreatedAt = function () {
    return _this.data && _this.data.createdAt;
  };

  this.getAccessTokenObject = function () {
    return _this.data;
  };

  this.isExpired = function () {
    var now = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();

    if (!_this.data || !_this.data.createdAt || !_this.data.expiresIn) {
      return null;
    }
    var expiredTime = new Date((Number(_this.data.createdAt) + Number(_this.data.expiresIn)) * 1000);
    return expiredTime > now;
  };

  this.hasAccessToken = function () {
    return !!_this.accessToken;
  };

  this.storage = storage;
  this.key = key;
  try {
    this.data = JSON.parse(this.storage.getItem(this.key) || 'null');
  } catch (e) {
    console.error(e);
  }
}

// public

;

export default TokenProvider;