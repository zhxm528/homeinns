class TokenStore {
  constructor() {
    this.token = null;
    this.refreshToken = null;
    this.expiresIn = null;
    this.createdAtMs = null;
    this.inFlight = null;
  }

  setToken(data) {
    this.token = data.accessToken;
    this.refreshToken = data.refreshToken || null;
    this.expiresIn = data.expiresIn;
    this.createdAtMs = Date.now();
  }

  clear() {
    this.token = null;
    this.refreshToken = null;
    this.expiresIn = null;
    this.createdAtMs = null;
  }

  isExpired(skewMs) {
    if (!this.token || !this.expiresIn || !this.createdAtMs) {
      return true;
    }
    const expiresAt = this.createdAtMs + this.expiresIn * 1000;
    return Date.now() + (skewMs || 0) >= expiresAt;
  }

  getAccessToken() {
    return this.token;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  setInFlight(promise) {
    this.inFlight = promise;
  }

  getInFlight() {
    return this.inFlight;
  }

  clearInFlight() {
    this.inFlight = null;
  }
}

module.exports = {
  TokenStore
};
