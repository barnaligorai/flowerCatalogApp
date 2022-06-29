const { fileHandler } = require('./handlers/fileHandler.js');
const { guestBookHandler } = require('./handlers/guestBookHandler.js');
const { notFound } = require('./handlers/notFound.js');

const app = (sourceDir = './public', resourceDir = './resource') => {
  const handlers = [fileHandler(sourceDir), guestBookHandler(resourceDir), notFound];
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
