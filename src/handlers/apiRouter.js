const express = require('express');

const serveAllComments = (request, response) => {
  const { guestBook } = request;
  response.json(guestBook.getComments());
};

const filterComments = (guestBook, user) => {
  const comments = guestBook.getComments();
  return comments.filter(comment =>
    comment.name.toLowerCase() === user.toLowerCase());
};

const serveCommentsOf = (request, response) => {
  const name = request.query.name;
  const { guestBook } = request;
  const selectedComments = filterComments(guestBook, name);
  response.json(selectedComments);
};

const serverLastId = (request, resposne) => {
  const lastId = { lastId: request.guestBook.lastId };
  resposne.json(lastId);
};

const serveCommentsAfter = (request, response) => {
  const { query, guestBook } = request;
  const lastId = query.after;

  const comments = guestBook.commentsAfter(lastId);
  response.json(comments);
};

const apiRouter = (guestBook) => {
  return (request, response) => {

    request.guestBook = guestBook;

    if (request.query.name) {
      serveCommentsOf(request, response);
      return;
    }

    if (request.query.q === 'last-id') {
      serverLastId(request, response);
      return;
    }

    if (request.query.after) {
      serveCommentsAfter(request, response);
      return;
    }

    serveAllComments(request, response);
  };
};

const createApiRouter = (guestBook) => {
  const apiRoute = express.Router();
  apiRoute.get('/comments*', apiRouter(guestBook));
  return apiRoute;
};

module.exports = { apiRouter, createApiRouter };
