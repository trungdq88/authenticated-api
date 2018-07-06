const DEFAULT_OPTIONS = {
  bodyPreprocessor: JSON.stringify,
  headers: { 'Content-Type': 'application/json' },
};
export default class Api {
  UNAUTHORIZED = 401;

  tokenProvider = null;
  prefix = null;

  constructor({ tokenProvider, prefix, fetcher, logging }) {
    this.tokenProvider = tokenProvider;
    this.prefix = prefix;
    this.fetcher = fetcher || ((...args) => fetch(...args));
    this.logging = logging || false;
  }

  // public

  get = url => this._send(url, { method: 'GET' });
  post = (...args) => this.method('POST', ...args);
  put = (...args) => this.method('PUT', ...args);
  patch = (...args) => this.method('PATCH', ...args);
  delete = (...args) => this.method('DELETE', ...args);

  // private

  method = (method, url, body, options) => {
    const { bodyPreprocessor, headers } = {
      ...DEFAULT_OPTIONS,
      ...options,
      headers: { ...DEFAULT_OPTIONS.headers, ...options.headers },
    };
    return this._send(url, {
      method,
      body: bodyPreprocessor ? bodyPreprocessor(body) : body,
      headers,
    });
  };

  _send = async (...args) =>
    this._sendWithRetry(() => this._authenticatedFetch(...args));

  _sendWithRetry = async sendRequest => {
    const firstTry = sendRequest();
    const isFirstTrySuccess = await firstTry.then(r => r.status);
    if (isFirstTrySuccess !== this.UNAUTHORIZED) return firstTry;
    this._log('Trying to renew access token...');
    await this.tokenProvider.renewToken();
    this._log('Retrying...');
    const secondTry = sendRequest();
    secondTry.then(r => {
      if (r.status === this.UNAUTHORIZED) {
        this._log('Cannot renew token', r);
      }
    });
    return secondTry; // If second try fail, give up
  };

  _authenticatedFetch = async (url, options) => {
    const headers = {
      authorization: `Bearer ${this.tokenProvider.getAccessToken()}`,
      ...options.headers,
    };
    return this.fetcher(this.prefix + url, {
      ...options,
      headers,
    });
  };

  _log = (...args) => this.logging && console.log('[API] ', ...args);
}
