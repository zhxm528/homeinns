class PropertiesService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async listProperties(params, options) {
    const query = new URLSearchParams();
    const input = params || {};

    if (input.statusCode) {
      query.set('statusCode', input.statusCode);
    }
    if (input.subsidiaryId) {
      query.set('subsidiaryId', input.subsidiaryId);
    }
    if (typeof input.recursive === 'boolean') {
      query.set('recursive', String(input.recursive));
    }
    if (input.sort) {
      query.set('sort', input.sort);
    }
    if (input.pageNumber) {
      query.set('pageNumber', String(input.pageNumber));
    }
    if (input.pageSize) {
      query.set('pageSize', String(input.pageSize));
    }
    if (input.filter) {
      query.set('filter', input.filter);
    }

    const path = '/api-gateway/configuration/v1/properties' + (query.toString() ? '?' + query.toString() : '');

    return await this.apiClient.request(path, {
      method: 'GET',
      correlationId: options && options.correlationId,
      tenantId: options && options.tenantId,
      propertyId: options && options.propertyId
    });
  }
}

module.exports = {
  PropertiesService
};
