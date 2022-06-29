const { fileHandler } = require('./handlers/fileHandler.js');
const { guestBookHandler } = require('./handlers/guestBookHandler.js');
const { notFound } = require('./handlers/notFound.js');
const { handleApiReq } = require('./handlers/handleApiReq.js');
const { GuestBook } = require('./handlers/guestBook.js');
const fs = require('fs');

const readFile = (fileName) => {
  return fs.readFileSync(fileName, 'utf8');
};

const fetchComments = (sourceDir) => {
  const fileName = sourceDir + '/guestBook.json';
  const comments = JSON.parse(readFile(fileName));
  return new GuestBook(comments, fileName);
};

const app = (sourceDir = './public', resourceDir = './resource') => {
  const guestBook = fetchComments(resourceDir);
  const template = readFile(resourceDir + '/guestbookTemplate.txt');
  const handlers = [
    fileHandler(sourceDir),
    guestBookHandler(guestBook, template),
    handleApiReq(guestBook),
    notFound
  ];
  return createRouter(handlers);
};

const createRouter = (handlers) => {
  return (request, response) => {
    for (const handler of handlers)
      if (handler(request, response))
        return;
  }
};

module.exports = { app };
