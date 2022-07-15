const express = require('express');

const serveAllComments = (req, res) => {
  const { guestBook } = req;
  res.json(guestBook.getComments());
};

const filterComments = (guestBook, user) => {
  const comments = guestBook.getComments();
  return comments.filter(comment =>
    comment.name.toLowerCase() === user.toLowerCase());
};

const serveCommentsOf = (req, res) => {
  // const name = req.query.name;
  const name = req.params.name;
  const { guestBook } = req;
  const selectedComments = filterComments(guestBook, name);
  res.json(selectedComments);
};

const serverLastId = (req, res, next) => {
  if (req.params.q !== 'last-id') {
    next();
    return;
  }

  const lastId = { lastId: req.guestBook.lastId };
  res.json(lastId);
};

const serveCommentsAfter = (req, res) => {
  const { params, guestBook } = req;
  const lastId = params.after;

  const comments = guestBook.commentsAfter(lastId);
  res.json(comments);
};

const injectGuestBook = (guestBook) => {
  return (req, res, next) => {
    req.guestBook = guestBook;
    next();
  }
};

const apiRouter = (guestBook) => {
  const router = express.Router();

  router.use(injectGuestBook(guestBook));
  router.get('/', serveAllComments);
  router.get('/q/:q', serverLastId);
  router.get('/name/:name', serveCommentsOf);
  router.get('/after/:after', serveCommentsAfter);

  return router;
};

module.exports = { apiRouter };
