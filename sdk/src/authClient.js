const { joinUrl, toFormBody, ensureOk } = require('./utils');

class AuthClient {
  constructor(config, tokenStore) {
    this.config = config;
    this.tokenStore = tokenStore;
  }

  async getValidAccessToken(options) {
    const forceRefresh = options && options.forceRefresh;
    const inFlight = this.tokenStore.getInFlight();
    if (inFlight) {
      return inFlight;
    }

    if (!forceRefresh && !this.tokenStore.isExpired(this.config.tokenSkewMs)) {
      return this.tokenStore.getAccessToken();
    }

    const promise = this.refreshOrLogin();
    this.tokenStore.setInFlight(promise);

    try {
      const token = await promise;
      return token;
    } finally {
      this.tokenStore.clearInFlight();
    }
  }

  async refreshOrLogin() {
    const refreshToken = this.tokenStore.getRefreshToken();
    if (refreshToken) {
      try {
        return await this.refreshToken(refreshToken);
      } catch (err) {
        return await this.loginWithPassword();
      }
    }
    return await this.loginWithPassword();
  }

  async loginWithPassword() {
    const body = toFormBody({
      grant_type: 'password',
      username: this.config.username,
      password: this.config.password,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret
    });

    const response = await fetch(joinUrl(this.config.baseUrl, '/connect/token'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body,
      signal: AbortSignal.timeout(this.config.timeoutMs)
    });

    const text = await response.text();
    ensureOk(response, text);
    const data = JSON.parse(text);

    this.tokenStore.setToken({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: parseInt(data.expires_in, 10)
    });

    return this.tokenStore.getAccessToken();
  }

  async refreshToken(refreshToken) {
    const body = toFormBody({
      grant_type: 'refresh_token',
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      refresh_token: refreshToken
    });

    const response = await fetch(joinUrl(this.config.baseUrl, '/connect/token'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body,
      signal: AbortSignal.timeout(this.config.timeoutMs)
    });

    const text = await response.text();
    ensureOk(response, text);
    const data = JSON.parse(text);

    this.tokenStore.setToken({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: parseInt(data.expires_in, 10)
    });

    return this.tokenStore.getAccessToken();
  }
}

module.exports = {
  AuthClient
};
