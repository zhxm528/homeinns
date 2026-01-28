# Shiji Token SDK (Node.js)

This SDK implements the token flow described in `md/sep/token_sdk_guide.md`.

## Install

Use as local source or copy into your project.

## Usage

```js
const { createClient } = require('./sdk');

const client = createClient({
  baseUrl: 'https://example.shiji.com',
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  username: 'user@tenant',
  password: 'your_password',
  tenantId: 'optional-tenant-id',
  timeoutMs: 15000
});

async function main() {
  const units = await client.propertyService.getUserUnits();
  console.log(units);

  const properties = await client.propertiesService.listProperties({
    statusCode: 'Published',
    pageNumber: 1,
    pageSize: 50,
    sort: '-createdAt'
  });
  console.log(properties);
}

main().catch(console.error);
```

## Notes

- Access tokens are cached in memory and refreshed automatically.
- For system users, pass `tenantId` to send `AC-Tenant-ID`.
- For multi-property calls, provide `propertyId` in request options.
