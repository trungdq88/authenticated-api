import Api from './Api.js';

describe('Api', () => {
  const fakeAccessToken = Math.random();
  const renewToken = Math.random();
  class MockTokenProvider {
    renewed = false;
    renewToken = jest.fn().mockImplementation(() => (this.renewed = true));
    getAccessToken = jest
      .fn()
      .mockImplementation(() => (this.renewed ? renewToken : fakeAccessToken));
  }
  const fakePrefix = `http://${Math.random()}`;
  const fakeBody = Math.random();

  it('should return what fetch returns', async () => {
    const mockTokenProvider = new MockTokenProvider();
    const mockFetch = jest
      .fn()
      .mockImplementation(() => ({ status: 200, body: fakeBody }));
    const api = new Api({
      tokenProvider: mockTokenProvider,
      prefix: fakePrefix,
      fetcher: mockFetch,
    });
    const response = await api.get('/hello');
    expect(response).toEqual({ status: 200, body: fakeBody });
  });

  it('should prepend prefix', async () => {
    const mockTokenProvider = new MockTokenProvider();
    const mockFetch = jest.fn().mockImplementation(() => ({ status: 200 }));
    const api = new Api({
      tokenProvider: mockTokenProvider,
      prefix: fakePrefix,
      fetcher: mockFetch,
    });
    await api.get('/hello');
    expect(mockFetch).toBeCalledWith(`${fakePrefix}/hello`, expect.anything());
  });

  it('should call fetch with authentication header', async () => {
    const mockTokenProvider = new MockTokenProvider();
    const mockFetch = jest.fn().mockImplementation(() => ({ status: 200 }));
    const api = new Api({
      tokenProvider: mockTokenProvider,
      prefix: fakePrefix,
      fetcher: mockFetch,
    });
    await api.get('/hello');
    expect(mockFetch).toBeCalledWith(`${fakePrefix}/hello`, {
      headers: {
        authorization: `Bearer ${fakeAccessToken}`,
      },
      method: 'GET',
    });
  });

  it('should retry if failed', async () => {
    const mockTokenProvider = new MockTokenProvider();
    const mockFetch = jest.fn().mockImplementation(() => ({ status: 401 }));
    const api = new Api({
      tokenProvider: mockTokenProvider,
      prefix: fakePrefix,
      fetcher: mockFetch,
    });
    await api.get('/hello');
    expect(mockTokenProvider.renewToken).toBeCalledWith();
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch.mock.calls[1][1].headers.authorization).toEqual(
      `Bearer ${renewToken}`,
    );
  });

  it('should remove undefined headers', async () => {
    const mockTokenProvider = new MockTokenProvider();
    const mockFetch = jest.fn().mockImplementation(() => ({ status: 200 }));
    const api = new Api({
      tokenProvider: mockTokenProvider,
      prefix: fakePrefix,
      fetcher: mockFetch,
    });
    await api.post('/hello', {}, { headers: { a: 1, b: undefined } });
    expect(mockFetch.mock.calls[0][1].headers).toEqual({
      'Content-Type': 'application/json',
      a: 1,
      authorization: `Bearer ${fakeAccessToken}`,
    });
  });
});
