const { createServer } = require('http');

const startServer = (PORT, handle) => {
  const server = createServer((request, response) => {
    request.url = new URL(`http://${request.headers.host}${request.url}`);
    console.log(new Date().toString(), request.method, request.url.pathname);
    handle(request, response);
  });
  server.listen(PORT, () => console.log(`Started listening on ${PORT}`));
};

module.exports = { startServer };
