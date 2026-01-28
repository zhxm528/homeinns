const { joinUrl, ensureOk } = require('./utils');

class ApiClient {
  constructor(config, authClient) {
    this.config = config;
    this.authClient = authClient;
  }

  async request(path, options) {
    const opts = options || {};
    const method = opts.method || 'GET';
    const headers = Object.assign({}, opts.headers || {});

    const token = await this.authClient.getValidAccessToken();
    headers.Authorization = 'Bearer ' + token;

    if (this.config.defaultLanguage && !headers['Accept-Language']) {
      headers['Accept-Language'] = this.config.defaultLanguage;
    }

    if (opts.correlationId) {
      headers['AC-Correlation-ID'] = opts.correlationId;
    }

    if (opts.tenantId || this.config.tenantId) {
      headers['AC-Tenant-ID'] = opts.tenantId || this.config.tenantId;
    }

    if (opts.propertyId) {
      headers['AC-Property-Id'] = opts.propertyId;
    }

    const response = await fetch(joinUrl(this.config.baseUrl, path), {
      method,
      headers,
      body: opts.body,
      signal: AbortSignal.timeout(this.config.timeoutMs)
    });

    if (response.status === 401) {
      await this.authClient.getValidAccessToken({ forceRefresh: true });
      return await this.retryRequest(path, opts);
    }

    const text = await response.text();
    ensureOk(response, text);
    return text ? JSON.parse(text) : null;
  }

  async retryRequest(path, options) {
    const opts = options || {};
    const headers = Object.assign({}, opts.headers || {});

    const token = await this.authClient.getValidAccessToken();
    headers.Authorization = 'Bearer ' + token;

    if (this.config.defaultLanguage && !headers['Accept-Language']) {
      headers['Accept-Language'] = this.config.defaultLanguage;
    }

    if (opts.correlationId) {
      headers['AC-Correlation-ID'] = opts.correlationId;
    }

    if (opts.tenantId || this.config.tenantId) {
      headers['AC-Tenant-ID'] = opts.tenantId || this.config.tenantId;
    }

    if (opts.propertyId) {
      headers['AC-Property-Id'] = opts.propertyId;
    }

    const response = await fetch(joinUrl(this.config.baseUrl, path), {
      method: opts.method || 'GET',
      headers,
      body: opts.body,
      signal: AbortSignal.timeout(this.config.timeoutMs)
    });

    const text = await response.text();
    ensureOk(response, text);
    return text ? JSON.parse(text) : null;
  }
}

module.exports = {
  ApiClient
};
