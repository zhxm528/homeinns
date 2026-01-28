function joinUrl(baseUrl, path) {
  const trimmedBase = baseUrl.replace(/\/$/, '');
  const trimmedPath = path.startsWith('/') ? path : '/' + path;
  return trimmedBase + trimmedPath;
}

function toFormBody(params) {
  const parts = [];
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }
    parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
  }
  return parts.join('&');
}

function ensureOk(response, bodyText) {
  if (response.ok) {
    return;
  }
  const err = new Error('HTTP ' + response.status + ': ' + bodyText);
  err.status = response.status;
  err.body = bodyText;
  if (response.status === 401) {
    err.code = 'UNAUTHORIZED';
  } else if (response.status === 403) {
    err.code = 'FORBIDDEN';
  } else if (response.status === 429) {
    err.code = 'RATE_LIMIT';
  }
  throw err;
}

module.exports = {
  joinUrl,
  toFormBody,
  ensureOk
};
