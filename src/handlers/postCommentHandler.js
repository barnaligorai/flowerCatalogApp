const { handleComment } = require('./handleComment.js');

const postCommentHandler = guestBook => (request, response, next) => {

  if (request.matches('POST', '/add-comment')) {
    request.guestBook = guestBook;
    handleComment(request, response);
    return;
  }

  next();
};

module.exports = { postCommentHandler };
