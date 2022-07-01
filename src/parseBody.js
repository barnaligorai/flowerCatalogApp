const parseBodyParams = (paramsString) => {
  const bodyParams = {};
  const params = new URLSearchParams(paramsString);
  for (const [field, value] of params.entries()) {
    bodyParams[field] = value;
  }
  return bodyParams;
};

const parseBody = (request, response, next) => {
  let data = '';
  request.on('data', chunk => {
    data += chunk;
  });

  request.on('end', () => {
    const bodyParams = parseBodyParams(data);
    request.bodyParams = bodyParams;
    next();
  })
};

module.exports = { parseBody };
