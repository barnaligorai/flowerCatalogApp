const { handleComment } = require('./handleComment.js');

const postCommentHandler = guestBook => (request, response, next) => {
  if (request.matches('POST', '/add-comment')) {
    request.guestBook = guestBook;
    return handleComment(request, response);
  }
  next();
};

module.exports = { postCommentHandler };
