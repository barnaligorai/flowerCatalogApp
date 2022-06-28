const divBlock = (divClass, body) => `<div class="${divClass}">${body}</div>`;

const formatPost = ({ author, comment, timeStamp }) => {
  const authorBlock = divBlock('author', `${author} : `);
  const commentBlock = divBlock('comment', comment);
  const timeStampBlock = divBlock('timeStamp', timeStamp);
  const contentBlock = divBlock('content', authorBlock + commentBlock);
  return divBlock('post', timeStampBlock + contentBlock);
};

const serveGuestBook = (response, comments, { readFile }, sourceDir) => {
  const fileName = sourceDir + '/guestbookTemplate.txt';
  const template = readFile(fileName, 'utf8');
  const commentsHtml = [];
  comments.getComments().reverse().forEach(comment => {
    commentsHtml.push(formatPost(comment));
  });

  response.send(template.replace('__COMMENTS__', commentsHtml.join('')));
};

module.exports = { serveGuestBook };
