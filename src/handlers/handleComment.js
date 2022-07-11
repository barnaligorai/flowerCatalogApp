const fs = require('fs');

const timeStamp = () => {
  const dateString = new Date().toLocaleString();
  const [date, time] = dateString.split(',');
  return date + time;
};

const addComment = (request) => {
  const { guestBook, bodyParams, currentSession } = request;
  const { comment } = bodyParams;
  const name = currentSession.username;
  const post = { name, comment, timeStamp: timeStamp() };
  guestBook.add(post);
  return post;
};

const updateDatabase = (guestBook) => {
  const commentsJson = JSON.stringify(guestBook.getComments());
  const fileName = guestBook.sourceFile;
  fs.writeFileSync(fileName, commentsJson, 'utf8');
};

const handleComment = (request, response) => {
  const comment = addComment(request);
  updateDatabase(request.guestBook);

  // redirect to guestBook
  // response.statusCode = 302;
  // response.setHeader('location', '/guestbook.html');
  response.setHeader('content-type', 'application/json');
  response.end(JSON.stringify(comment));
};

module.exports = { handleComment };
