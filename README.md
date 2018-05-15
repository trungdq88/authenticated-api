# Authenticated API

Send API with auto renew access token logic

*Notice:* using same Babel config as create-react-app.

# Usage

    yarn install authenticated-api

Create TokenProvider:

    const tokenProvider = new TokenProvider();

Create API:

    const api = new Api({
      tokenProvider,
      prefix: process.env.REACT_APP_API_ENDPOINT,
    });

(Somewhere in your app) after get access token and refresh token:

    tokenProvider.setToken({ accessToken, refreshToken });

Now you can call authenticated request with API object:

    const response = api.get('https://somewhere.com/api/something');

# Options

## Api

    const api = new Api(options);

`options` have following keys:

- `tokenProvider`: token provider.
- `prefix`: host name
- `fetcher`: the method to call for request, default is global `window.fetch`;
- `logging`: true/false whether print debug log or not

## TokenProvider

API object will expect TokenProvider to have the following methods:

- `getAccessToken()`: return access token
- `renewToken()` (async): renew the access token
