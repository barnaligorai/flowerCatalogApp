const fs = require('fs');

const addComment = (request) => {
  const { guestBook, body, currentSession } = request;
  const { comment } = body;
  const name = currentSession.username;
  const post = guestBook.add(name, comment);
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
  response.end(JSON.stringify(comment));
};

module.exports = { handleComment };
