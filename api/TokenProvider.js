// Persistence token manage layer
export default class TokenProvider {
  hbAccessToken = null;
  accessToken = null;

  constructor({
    accessTokenKey = 'accessToken',
    refreshTokenKey = 'refreshToken',
  } = {}) {
    this.accessTokenKey = accessTokenKey;
    this.refreshTokenKey = refreshTokenKey;
    this.accessToken = localStorage.getItem(this.accessTokenKey);
    this.refreshToken = localStorage.getItem(this.refreshTokenKey);
  }

  // public

  setToken = ({ accessToken, refreshToken }) => {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  };

  renewToken = async () => {
    // TODO: refresh token not working in BeePayCore, no way to renew token
  };

  getAccessToken = () => this.accessToken;

  hasAccessToken = () => !!this.accessToken;

  // private
}
