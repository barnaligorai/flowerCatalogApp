const { GuestBook } = require('./handlers/guestBook.js');
const { postCommentHandler } = require('./handlers/postCommentHandler.js');
const { guestBookHandler } = require('./handlers/guestBookHandler.js');
const { apiRouter, createApiRouter } = require('./handlers/apiRouter.js');
const { injectCookies } = require('./server/injectCookies.js');
const { serveLoginPage } = require('./handlers/serveLoginPage.js');
const { newLogin } = require('./handlers/newLogin.js');
const { injectSession } = require('./server/injectSession.js');
const { serveRegistrationPage } = require('./handlers/serveRegistrationPage.js');
const { newRegistration } = require('./handlers/newRegistration.js');
const { logoutHandler } = require('./handlers/logoutHandler.js');
const fsModule = require('fs');

const express = require('express');

const readFile = (fileName, fs = fsModule) => {
  return fs.readFileSync(fileName, 'utf8');
};

const getLastId = (comments) => {
  return comments[0] ? comments[0].id : 0;
};

const fetchComments = (fileName, fs = fsModule) => {
  if (!fs.existsSync(fileName)) {
    fs.writeFileSync(fileName, JSON.stringify([]), 'utf-8');
  }
  const comments = JSON.parse(readFile(fileName));
  const id = getLastId(comments);
  return new GuestBook(comments, id);
};

const logRequest = (logger) => (req, res, next) => {
  logger(req.method, req.url);
  next();
};

const createApp = ({ templateFile = './resource/guestbookTemplate.html', dataFile = './data/guestBook.json' }, sessions, users, logger) => {
  const app = express();

  const guestBook = fetchComments(dataFile);
  const template = readFile(templateFile);

  app.use(logRequest(logger));
  app.use(express.urlencoded({ extended: true }));
  app.use(injectCookies);
  app.use(injectSession(sessions));

  app.get('/login', serveLoginPage(sessions, users));
  app.post('/login', newLogin(sessions, users));

  app.get('/logout', logoutHandler(sessions));

  app.get('/register', serveRegistrationPage);
  app.post('/register', newRegistration(users));

  app.get('/guestbook', guestBookHandler(guestBook, template));

  app.use('/api', createApiRouter(guestBook));

  app.post('/add-comment', postCommentHandler(guestBook, dataFile));

  app.use(express.static('public'));

  return app;
};

module.exports = { createApp };
