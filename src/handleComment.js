const fs = require('fs');

const fetchComments = () =>
  JSON.parse(fs.readFileSync('./comments/comments.json', 'utf8'));

const timeStamp = () => new Date().toString();

const savePost = (post) => {
  const comments = fetchComments();
  comments.push(post);
  fs.writeFileSync('./comments/comments.json', JSON.stringify(comments), 'utf8');
};

const redirectToGuestPage = (response) => {
  response.statusCode = 302;
  response.setHeader('location', '/guestbook.html');
  response.send('');
};

const handleComment = (request, response) => {
  const { name, comment } = request.queryParams;
  let author = name;
  if (!author) {
    author = 'Guest'
  }
  const post = { author, comment, timeStamp: timeStamp() };
  savePost(post);

  redirectToGuestPage(response);
};

module.exports = { handleComment, fetchComments };
