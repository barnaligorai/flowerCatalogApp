const fs = require('fs');
const path = require('path');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.gif': 'image/gif',
};

const mimeType = (fileName) => {
  const extension = path.extname(fileName);
  return mimeTypes[extension] || 'text/plain';
};

const fileHandler = (sourceDir) => (request, response) => {
  const { pathname } = request.url;
  let fileName = sourceDir + pathname;
  if (pathname === '/') {
    fileName = fileName + 'index.html';
  }

  try {
    const content = fs.readFileSync(fileName);
    response.setHeader('Content-Type', mimeType(fileName));
    response.statusCode = 200;
    response.end(content);
  } catch (error) {
    return false;
  }
  return true;
};

module.exports = { fileHandler };
