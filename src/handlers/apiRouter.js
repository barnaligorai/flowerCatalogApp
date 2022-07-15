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
  const name = req.query.name;
  const { guestBook } = req;
  const selectedComments = filterComments(guestBook, name);
  res.json(selectedComments);
};

const serverLastId = (req, resposne) => {
  const lastId = { lastId: req.guestBook.lastId };
  resposne.json(lastId);
};

const serveCommentsAfter = (req, res) => {
  const { query, guestBook } = req;
  const lastId = query.after;

  const comments = guestBook.commentsAfter(lastId);
  res.json(comments);
};

const apiRouter = (guestBook) => {
  return (req, res) => {
    req.guestBook = guestBook;

    if (req.query.name) {
      serveCommentsOf(req, res);
      return;
    }

    if (req.query.q === 'last-id') {
      serverLastId(req, res);
      return;
    }

    if (req.query.after) {
      serveCommentsAfter(req, res);
      return;
    }

    serveAllComments(req, res);
  };
};

module.exports = { apiRouter };
