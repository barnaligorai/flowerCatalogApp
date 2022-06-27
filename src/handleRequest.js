const fs = require('fs');

const html = (body) => `<html><body><h1>${body}</h1></body></html>`;

const handleHomePage = (response) => {
  const homePage = fs.readFile('./public/home.html', (err, data) => {
    if (!err) {
      response.send(data);
    }
  });
};

const handleError = (response) => {
  response.statusCode = 404;
  response.send(html('File Not Found'));
};


const serverFile = (fileName, response) => {
  console.log(fileName);
  if (fileName === './public/') {
    handleHomePage(response);
    return;
  }

  response.send(fs.readFileSync(fileName));
};

const handleRequest = ({ uri }, response) => {
  const dir = './public';
  const fileName = dir + uri;
  if (fs.existsSync(fileName)) {
    response.setHeader('Content-Type', 'text/html');
    serverFile(fileName, response);
    return true;
  }

  handleError(response);
};

module.exports = { handleRequest };
