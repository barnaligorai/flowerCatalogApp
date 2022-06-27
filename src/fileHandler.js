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

const serveFileContent = (response, fileName, { readFile }) => {
  const fileContent = readFile(fileName);
  if (fileContent) {
    response.send(fileContent);
  }
};

const fileHandler = ({ uri }, response, comments, fileProcessor, sourceDir) => {
  let fileName = sourceDir + uri;

  if (uri === '/') {
    fileName = fileName + 'home.html';
  }

  response.setHeader('Content-Type', contentType(fileName));

  if (fileProcessor.existsSync(fileName)) {
    serveFileContent(response, fileName, fileProcessor);
    return true;
  }
  return false;
};

module.exports = { fileHandler, serveFileContent };
