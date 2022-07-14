const generateGuestBookHtml = (template, guestBook) => {
  return template.replace('__COMMENTS__', guestBook.toHtml());
};

const guestBookHandler = (guestBook, template) => {
  return (request, response, next) => {
    if (!request.currentSession) {
      response.statusCode = 302;
      response.setHeader('location', '/login');
      response.end('need to login');
      return;
    }

    const content = generateGuestBookHtml(template, guestBook);
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');
    response.end(content);
    return;
  }
};

module.exports = { guestBookHandler };
