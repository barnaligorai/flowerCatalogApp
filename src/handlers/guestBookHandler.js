const express = require('express');
const { apiRouter } = require('./apiRouter');
const { postCommentHandler } = require('./postCommentHandler');

const generateGuestBookHtml = (template, guestBook) => {
  return template.replace('__COMMENTS__', guestBook.toHtml());
};

const serveGuestBook = (template, guestBook) => (req, res, next) => {
  const content = generateGuestBookHtml(template, guestBook);
  res.setHeader('Content-Type', 'text/html');
  res.end(content);
};

const auth = (req, res, next) => {
  if (!req.currentSession) {
    res.redirect(302, '/login');
    return;
  }
  next();
};

const guestBookHandler = (guestBook, template, dataFile) => {
  const guestbookRouter = express.Router();

  guestbookRouter.use(auth);

  guestbookRouter.get('', serveGuestBook(template, guestBook));

  guestbookRouter.use('/comments', apiRouter(guestBook));

  guestbookRouter.post('/add-comment', postCommentHandler(guestBook, dataFile));

  return guestbookRouter;
};

module.exports = { guestBookHandler };
