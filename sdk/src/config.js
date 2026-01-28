function createConfig(options) {
  if (!options) {
    throw new Error('Config is required');
  }

  const config = {
    baseUrl: options.baseUrl,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    username: options.username,
    password: options.password,
    tenantId: options.tenantId || null,
    timeoutMs: options.timeoutMs || 15000,
    tokenSkewMs: options.tokenSkewMs || 30000,
    defaultLanguage: options.defaultLanguage || null
  };

  validateConfig(config);
  return config;
}

function validateConfig(config) {
  const required = ['baseUrl', 'clientId', 'clientSecret', 'username', 'password'];
  for (const key of required) {
    if (!config[key] || typeof config[key] !== 'string') {
      throw new Error('Missing or invalid config: ' + key);
    }
  }
}

module.exports = {
  createConfig
};
