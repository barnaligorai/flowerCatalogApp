const { handleComment } = require('./handleComment.js');

const postCommentHandler = guestBook => (request, response, next) => {

  if (request.matches('POST', '/add-comment')) {
    if (!request.currentSession) {
      response.statusCode = 302;
      response.setHeader('location', '/login');
      response.end('need to login first');
      return;
    }

    request.guestBook = guestBook;
    handleComment(request, response);
    return;
  }

  next();
};

module.exports = { postCommentHandler };
