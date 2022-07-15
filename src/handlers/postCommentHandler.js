const fileSystem = require('fs');

const addComment = (request) => {
  const { guestBook, body, currentSession } = request;
  const { comment } = body;
  const name = currentSession.username;
  const post = guestBook.add(name, comment);
  return post;
};

const updateDatabase = (guestBook, dataFile, fs = fileSystem) => {
  const commentsJson = JSON.stringify(guestBook.getComments());
  fs.writeFileSync(dataFile, commentsJson, 'utf8');
};

const postCommentHandler = (guestBook, dataFile) =>
  (request, response) => {

    request.guestBook = guestBook;
    const comment = addComment(request);
    updateDatabase(guestBook, dataFile);
    response.json(comment);
  };

module.exports = { postCommentHandler };
