const { fileHandler } = require('./handlers/fileHandler.js');
const { notFound } = require('./handlers/notFound.js');

const app = (sourceDir = './public') => {
  const handlers = [fileHandler(sourceDir), notFound];
  return createHandler(handlers);
};

const createHandler = (handlers) => {
  return (request, response) => {
    for (const handler of handlers)
      if (handler(request, response))
        return;
  }
};

module.exports = { createHandler, app };
