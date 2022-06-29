const { handleComment } = require('./handleComment.js');

const generateGuestBookHtml = (template, guestBook) => {
  return template.replace('__COMMENTS__', guestBook.toHtml());
};

const guestBookHandler = (guestBook, template) => {
  return (request, response) => {
    if (request.matches('GET', '/add-comment')) {
      request.guestBook = guestBook;
      return handleComment(request, response);
    }

    if (request.matches('GET', '/guestbook.html')) {
      const content = generateGuestBookHtml(template, guestBook);
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/html');
      response.end(content);
      return true;
    }

    return false;
  };
};

module.exports = { guestBookHandler };
