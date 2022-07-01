const { fileHandler } = require('./handlers/fileHandler.js');
const { guestBookHandler } = require('./handlers/guestBookHandler.js');
const { notFound } = require('./handlers/notFound.js');
const { apiRouter } = require('./handlers/apiRouter.js');
const { createRouter } = require('./server/createRouter.js');
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
  const template = readFile(resourceDir + '/guestbookTemplate.html');
  const handlers = [
    fileHandler(sourceDir),
    guestBookHandler(guestBook, template),
    apiRouter(guestBook),
    notFound
  ];
  return createRouter(handlers);
};

module.exports = { app };
