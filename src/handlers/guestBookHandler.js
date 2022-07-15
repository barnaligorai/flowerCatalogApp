const generateGuestBookHtml = (template, guestBook) => {
  return template.replace('__COMMENTS__', guestBook.toHtml());
};

const guestBookHandler = (guestBook, template) => {
  return (request, response) => {
    if (!request.currentSession) {
      response.redirect(302, '/login');
      return;
    }

    const content = generateGuestBookHtml(template, guestBook);
    response.setHeader('Content-Type', 'text/html');
    response.end(content);
    return;
  }
};

module.exports = { guestBookHandler };
