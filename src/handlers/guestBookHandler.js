const fs = require('fs');
const { GuestBook } = require('./guestBook.js');
const { handleComment } = require('./handleComment.js');

const readFile = (fileName) => {
  return fs.readFileSync(fileName, 'utf8');
};

const fetchComments = (sourceDir) => {
  const fileName = sourceDir + '/comments.json';
  const comments = JSON.parse(readFile(fileName));
  return new GuestBook(comments, fileName);
};

const readTemplate = (sourceDir) => {
  const fileName = sourceDir + '/guestbookTemplate.txt';
  return readFile(fileName);
};

const generateGuestBookHtml = (template, comments) => {
  return template.replace('__COMMENTS__', comments.toHtml());
};

const guestBookHandler = sourceDir => {
  const template = readTemplate(sourceDir);
  const guestbook = fetchComments(sourceDir);

  return (request, response) => {
    if (request.matches('GET', '/add-comment')) {
      request.guestbook = guestbook;
      return handleComment(request, response);
    }

    if (request.matches('GET', '/guestbook.html')) {
      const content = generateGuestBookHtml(template, guestbook);
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/html');
      response.end(content);
      return true;
    }

    return false;
  };
};

module.exports = { guestBookHandler };
