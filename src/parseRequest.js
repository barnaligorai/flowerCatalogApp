const parseQueryParams = (queryParamsString) => {
  const searchParams = new URLSearchParams(queryParamsString);
  const queryParams = {};
  [...searchParams.entries()].forEach(([key, value]) =>
    queryParams[key] = value);
  return queryParams;
};

const parseUri = (rawUri) => {
  const [uri, queryParamsString] = rawUri.split('?');
  const queryParams = parseQueryParams(queryParamsString);
  return { uri, queryParams };
};

const parseRequestLine = (requestLine) => {
  const [method, uri, httpVersion] = requestLine.trim().split(' ');
  return { method, ...parseUri(uri), httpVersion };
};

const splitHeader = (header) => {
  const indexOfSeperator = header.indexOf(':');
  const key = header.slice(0, indexOfSeperator).trim().toLowerCase();
  const value = header.slice(indexOfSeperator + 1).trim().toLowerCase();
  return [key, value];
};

const parseHeaders = (headers) => {
  const parsedHeaders = {};
  let index = 0;
  while (headers.length > 0 && headers[index]) {
    const [key, value] = splitHeader(headers[index]);
    parsedHeaders[key] = value;
    index++;
  }
  return parsedHeaders;
};

const parseRequest = (request) => {
  const lines = request.split('\r\n');
  const requestLine = parseRequestLine(lines[0]);
  const headers = parseHeaders(lines.slice(1));

  const req = { ...requestLine, headers };
  return req;
};

module.exports = { parseRequest, parseHeaders, parseRequestLine, splitHeader };
