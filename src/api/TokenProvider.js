// Persistence token manage layer
export default class TokenProvider {
  hbAccessToken = null;
  accessToken = null;

  constructor(
    {
      accessTokenKey = 'accessToken',
      refreshTokenKey = 'refreshToken',
      expirationKey = 'accessTokenExpiration'
    } = {}
  ) {
    this.accessTokenKey = accessTokenKey;
    this.refreshTokenKey = refreshTokenKey;
    this.expirationKey = expirationKey;
    this.accessToken = localStorage.getItem(this.accessTokenKey);
    this.refreshToken = localStorage.getItem(this.refreshTokenKey);
    this.expiration = localStorage.getItem(this.expirationKey);
  }

  // public

  setToken = ({ accessToken, refreshToken, expiration }) => {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiration = expiration;
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    localStorage.setItem(this.expirationKey, expiration);
  };

  renewToken = async () => {
    // TODO: refresh token not working in BeePayCore, no way to renew token
  };

  getAccessToken = () => this.accessToken;

  getAccessTokenExpiration = () => this.expiration;

  hasAccessToken = () => !!this.accessToken;

  // private
}
