const parseBodyParams = (paramsString) => {
  const bodyParams = {};

  if (!paramsString) {
    return bodyParams;
  }

  const params = new URLSearchParams(paramsString);
  for (const [field, value] of params.entries()) {
    bodyParams[field] = value;
  }
  return bodyParams;
};

const injectBody = (request, response, next) => {
  let data = '';
  request.on('data', chunk => {
    data += chunk;
  });

  request.on('end', () => {
    const bodyParams = parseBodyParams(data);
    request.body = bodyParams;
    next();
  })
};

module.exports = { injectBody };
