const fs = require('fs');
const fetchComments = require('./handleComment.js').fetchComments;

const divBlock = (divClass, body) => `<div class="${divClass}">${body}</div>`;

const formatPost = (post) => {
  const { author, comment, timeStamp } = post;
  const authorBlock = divBlock('author', author);
  const commentBlock = divBlock('comment', comment);
  const timeStampBlock = divBlock('timeStamp', timeStamp);
  return divBlock('comment', authorBlock + commentBlock + timeStampBlock);
};

const serveGuestBook = (response) => {
  const comments = fetchComments();
  const template = fs.readFileSync('./public/guestbookTemplate.txt', 'utf8');
  const commentsHtml = [];
  comments.reverse().forEach(post => {
    commentsHtml.push(formatPost(post));
  });

  response.send(template.replace('__COMMENTS__', commentsHtml.join('')));
};

module.exports = { serveGuestBook };
