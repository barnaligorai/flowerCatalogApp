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

const apiRouter = (guestBook) => {
  return (request, response, next) => {
    if (request.matches('GET', '/comments')) {
      request.guestBook = guestBook;

      if (request.url.searchParams.get('name')) {
        serveCommentsOf(request, response);
        return;
      }
      serveAllComments(request, response);
      return;
    }
    next();
  };
};

module.exports = { apiRouter };
