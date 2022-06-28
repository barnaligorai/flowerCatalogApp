const { serveGuestBook } = require('./serveGuestBook.js');

const timeStamp = () => {
  const dateString = new Date().toLocaleString();
  const [date, time] = dateString.split(',');
  return date + time;
};

const updateDatabase = (comments, { writeFile }, sourceDir) => {
  const commentsJson = JSON.stringify(comments.getComments());
  const fileName = sourceDir + '/comments/comments.json';
  writeFile(fileName, commentsJson, 'utf8');
};

const redirectToGuestPage = (response) => {
  response.statusCode = 302;
  response.setHeader('location', '/guestbook.html');
  response.send('');
};

const handleComment = (request, response, comments, fileProcessor, sourceDir) => {
  const { uri } = request;
  if (uri === '/guestbook.html') {
    serveGuestBook(response, comments, fileProcessor, sourceDir);
    return true;
  }

  if (uri === '/comment') {
    const { name, comment } = request.queryParams;
    let author = name;
    if (!author) {
      author = 'Guest'
    }
    const post = { author, comment, timeStamp: timeStamp() };
    comments.add(post);
    updateDatabase(comments, fileProcessor, sourceDir);
    redirectToGuestPage(response);
    return true;
  }
  return false;
};

module.exports = { handleComment };
