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
  const fakeHostname = `http://${Math.random()}`;
  const fakeBody = Math.random();

  it('should return what fetch returns', async () => {
    const mockTokenProvider = new MockTokenProvider();
    const mockFetch = jest
      .fn()
      .mockImplementation(() => ({ status: 200, body: fakeBody }));
    const api = new Api({
      tokenProvider: mockTokenProvider,
      hostname: fakeHostname,
      fetcher: mockFetch,
    });
    const respnose = await api.get('/hello');
    expect(respnose).toEqual({ status: 200, body: fakeBody });
  });

  it('should prepend hostname', async () => {
    const mockTokenProvider = new MockTokenProvider();
    const mockFetch = jest.fn().mockImplementation(() => ({ status: 200 }));
    const api = new Api({
      tokenProvider: mockTokenProvider,
      hostname: fakeHostname,
      fetcher: mockFetch,
    });
    await api.get('/hello');
    expect(mockFetch).toBeCalledWith(
      `${fakeHostname}/hello`,
      expect.anything(),
    );
  });

  it('should call fetch with authentication header', async () => {
    const mockTokenProvider = new MockTokenProvider();
    const mockFetch = jest.fn().mockImplementation(() => ({ status: 200 }));
    const api = new Api({
      tokenProvider: mockTokenProvider,
      hostname: fakeHostname,
      fetcher: mockFetch,
    });
    await api.get('/hello');
    expect(mockFetch).toBeCalledWith(`${fakeHostname}/hello`, {
      headers: {
        'Content-Type': 'application/json',
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
      hostname: fakeHostname,
      fetcher: mockFetch,
    });
    await api.get('/hello');
    expect(mockTokenProvider.renewToken).toBeCalledWith();
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch.mock.calls[1][1].headers.authorization).toEqual(
      `Bearer ${renewToken}`,
    );
  });
});
