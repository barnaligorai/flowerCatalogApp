const html = (body) => `<html><body><h1>${body}</h1></body></html>`;

const notFound = (request, response) => {
  response.statusCode = 404;
  response.setHeader('Content-Type', 'text/html');
  response.end(html('This site can\'t be reached'));
};

module.exports = { notFound };
