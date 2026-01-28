class PropertyService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async getUserUnits(options) {
    return await this.apiClient.request('/permission-management/users/me/units', {
      method: 'GET',
      correlationId: options && options.correlationId,
      tenantId: options && options.tenantId,
      propertyId: options && options.propertyId
    });
  }
}

module.exports = {
  PropertyService
};
