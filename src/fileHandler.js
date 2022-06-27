const fs = require('fs');
const { serveGuestBook } = require('./serveGuestBook.js');

const contentType = (fileName) => {
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.jpg': 'image/jpg',
    '.png': 'image/png',
  };
  const extension = fileName.slice(fileName.lastIndexOf('.'));
  const type = contentTypes[extension];
  return type ? type : 'text/plain';
};

const serveFileContent = (response, fileName) => {
  fs.readFile(fileName, (err, data) => {
    if (!err) {
      response.send(data)
    }
  });
};

const fileHandler = (request, response, sourceDir = './public') => {
  let { uri } = request;
  let fileName = sourceDir + uri;

  if (uri === '/') {
    fileName = fileName + 'home.html';
  }

  response.setHeader('Content-Type', contentType(fileName));
  if (uri === '/guestbook.html') {
    serveGuestBook(response);
    return true;
  }

  if (fs.existsSync(fileName)) {
    serveFileContent(response, fileName);
    return true;
  }
  return false;
};

module.exports = { fileHandler, serveFileContent };
