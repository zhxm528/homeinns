const { createConfig } = require('./src/config');
const { TokenStore } = require('./src/tokenStore');
const { AuthClient } = require('./src/authClient');
const { ApiClient } = require('./src/apiClient');
const { PropertyService } = require('./src/propertyService');
const { PropertiesService } = require('./src/propertiesService');

function createClient(options) {
  const config = createConfig(options);
  const tokenStore = new TokenStore();
  const authClient = new AuthClient(config, tokenStore);
  const apiClient = new ApiClient(config, authClient);
  const propertyService = new PropertyService(apiClient);
  const propertiesService = new PropertiesService(apiClient);

  return {
    config,
    authClient,
    apiClient,
    propertyService,
    propertiesService
  };
}

module.exports = {
  createClient,
  TokenStore,
  AuthClient,
  ApiClient,
  PropertyService,
  PropertiesService
};
