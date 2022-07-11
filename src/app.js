const { postCommentHandler } = require('./handlers/postCommentHandler.js');
const { fileHandler } = require('./handlers/fileHandler.js');
const { guestBookHandler } = require('./handlers/guestBookHandler.js');
const { notFound } = require('./handlers/notFound.js');
const { apiRouter } = require('./handlers/apiRouter.js');
const { createRouter } = require('./server/createRouter.js');
const { parseBody } = require('./server/parseBody.js');
const { injectCookies } = require('./server/injectCookies.js');
const { loginHandler } = require('./handlers/loginHandler.js');
const { GuestBook } = require('./handlers/guestBook.js');
const fs = require('fs');
const { injectSession } = require('./server/injectSession.js');
const { registrationHandler } = require('./handlers/registrationHandler.js');
const { Sessions } = require('./sessions.js');
const { logoutHandler } = require('./handlers/logoutHandler.js');

const readFile = (fileName) => {
  return fs.readFileSync(fileName, 'utf8');
};

const getLastId = (comments) => {
  return comments[0].id;
};

const fetchComments = (sourceDir) => {
  const fileName = sourceDir + '/guestBook.json';
  const comments = JSON.parse(readFile(fileName));
  const id = getLastId(comments);
  return new GuestBook(comments, fileName, id);
};

const app = (sourceDir = './public', resourceDir = './resource') => {
  const sessions = new Sessions();
  const users = [];
  const guestBook = fetchComments(resourceDir);
  const template = readFile(resourceDir + '/guestbookTemplate.html');
  const handlers = [
    parseBody,
    injectCookies,
    injectSession(sessions),
    registrationHandler(users),
    loginHandler(sessions, users),
    logoutHandler(sessions),
    guestBookHandler(guestBook, template),
    fileHandler(sourceDir),
    apiRouter(guestBook),
    postCommentHandler(guestBook),
    notFound
  ];
  return createRouter(handlers);
};

module.exports = { app };
