const serveAllComments = (request, response) => {
  const { guestBook } = request;
  const jsonComments = JSON.stringify(guestBook.getComments());
  response.statuscode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.end(jsonComments);
};

const filterComments = (guestBook, user) => {
  const comments = guestBook.getComments();
  return comments.filter(comment =>
    comment.name.toLowerCase() === user.toLowerCase());
};

const serveCommentsOf = (request, response) => {
  const { guestBook, url } = request;
  const name = url.searchParams.get('name');
  const selectedComments = filterComments(guestBook, name);

  response.statuscode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(selectedComments));
};

const serverLastId = (request, resposne) => {
  const lastId = { lastId: request.guestBook.lastId };
  resposne.setHeader('content-type', 'application/json');
  resposne.end(JSON.stringify(lastId));
};

const serveCommentsAfter = (request, response) => {
  const { url, guestBook } = request;
  const lastId = url.searchParams.get('after');

  const comments = guestBook.commentsAfter(lastId);
  response.setHeader('content-type', 'application/json');
  response.end(JSON.stringify(comments));
};

const apiRouter = (guestBook) => {
  return (request, response, next) => {
    if (!request.matches('GET', '/api/comments')) {
      next();
      return;
    }

    request.guestBook = guestBook;

    const { searchParams } = request.url;

    if (searchParams.get('name')) {
      serveCommentsOf(request, response);
      return;
    }

    if (searchParams.get('q') === 'last-id') {
      serverLastId(request, response);
      return;
    }

    if (searchParams.get('after')) {
      serveCommentsAfter(request, response);
      return;
    }

    serveAllComments(request, response);
    return;
  };
};

module.exports = { apiRouter };
