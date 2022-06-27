const { createServer } = require('net');
const { parseRequest } = require('./parseRequest.js');
const { Response } = require('./response.js');
const { fileHandler } = require('./fileHandler.js');
const { handleError } = require('./handleError.js');


const startServer = (PORT) => {
  const server = createServer(socket => {
    const response = new Response(socket);
    socket.on('data', chunk => {
      const request = parseRequest(chunk.toString());
      const { method, uri, httpVersion } = request;

      console.log(new Date().toString(), method, uri, httpVersion);

      if (fileHandler(request, response)) {
        return;
      }
      handleError(response);
    });
  });
  server.listen(PORT, () => console.log(`Started listening on ${PORT}`));
};

module.exports = { startServer };
