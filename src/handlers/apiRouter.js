const serveAllComments = (request, response) => {
  const { guestBook } = request;
  const jsonComments = JSON.stringify(guestBook.getComments());
  response.statuscode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.end(jsonComments);
  return true;
};

const filterComments = (guestBook, user) => {
  const comments = guestBook.getComments();
  return comments.filter(comment =>
    comment.name.toLowerCase() === user.toLowerCase());
};

const serveCommentsOf = (request, response) => {
  const { guestBook, url } = request;
  const user = url.pathname.split('/')[2];
  const selectedComments = filterComments(guestBook, user);

  response.statuscode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(selectedComments));
  return true;
};

const apiRouter = (guestBook) => {
  return (request, response) => {
    const { pathname } = request.url;
    if (!pathname.startsWith('/comments')) {
      return false;
    }

    if (pathname === '/comments/all' || pathname === '/comments') {
      request.guestBook = guestBook;
      return serveAllComments(request, response);
    }

    if (pathname.startsWith('/comments/')) {
      request.guestBook = guestBook;
      return serveCommentsOf(request, response);
    }
    return false;
  };
};

module.exports = { apiRouter };
