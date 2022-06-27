const { createServer } = require('net');
const { parseRequest } = require('./parseRequest.js');
const { Response } = require('./response.js');
const { fileHandler } = require('./fileHandler.js');
const { handleComment } = require('./handleComment.js');
const { notFound } = require('./notFound.js');
const { Comments } = require('./comments.js');

const fetchComments = ({ readFile }, sourceDir,) => {
  const fileName = sourceDir + '/comments/comments.json';
  const comments = JSON.parse(readFile(fileName, 'utf8'));
  return new Comments(comments);
};

const createHandler = (handlers) => {
  return (request, response, comments, fileProcessor, sourceDir) => {
    for (const handler of handlers)
      if (handler(request, response, comments, fileProcessor, sourceDir))
        return;
  }
};

const onNewConnection = (socket, handle, comments, fileProcessor, sourceDir) => {
  const response = new Response(socket);

  socket.on('data', chunk => {
    const request = parseRequest(chunk.toString());
    const { method, uri, httpVersion } = request;
    console.log(new Date().toString(), method, uri, httpVersion);
    handle(request, response, comments, fileProcessor, sourceDir);
  });

};

const startServer = (PORT, fileProcessor, sourceDir = './public') => {

  const handlers = [fileHandler, handleComment, notFound];
  const comments = fetchComments(fileProcessor, sourceDir);
  const server = createServer(socket =>
    onNewConnection(socket, createHandler(handlers), comments, fileProcessor, sourceDir));

  server.listen(PORT, () => console.log(`Started listening on ${PORT}`));
};

module.exports = { startServer };
