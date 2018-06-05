// Persistence token manage layer
const KEY = 'accessToken';

export default class TokenProvider {
  data = null;

  constructor({ storage = window.localStorage, key = KEY } = {}) {
    this.storage = storage;
    this.key = key;
    try {
      this.data = JSON.parse(this.storage.getItem(this.key) || 'null');
    } catch (e) {
      console.error(e);
    }
  }

  // public

  setToken = ({ accessToken, refreshToken, expiresIn, createdAt }) => {
    this.data = { accessToken, refreshToken, expiresIn, createdAt };
    this.storage.setItem(this.key, JSON.stringify(this.data));
  };

  renewToken = async () => {
    // TODO: refresh token not working in BeePayCore, no way to renew token
  };

  getAccessToken = () => this.data && this.data.accessToken;

  getAccessTokenExpiration = () => this.data && this.data.expiresIn;

  getAccessTokenCreatedAt = () => this.data && this.data.createdAt;

  getAccessTokenObject = () => this.data;

  isExpired = (now = new Date()) => {
    const expiredTime = new Date(
      (Number(this.data.createdAt) + Number(this.data.expiresIn)) * 1000
    );
    return expiredTime > now;
  };

  hasAccessToken = () => !!this.accessToken;

  // private
}
