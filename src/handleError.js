const html = (body) => `<html><body><h1>${body}</h1></body></html>`;

const handleError = (response) => {
  response.statusCode = 404;
  response.setHeader('content-type', 'text/html')
  response.send(html('File Not Found'));
};

module.exports = { handleError };
