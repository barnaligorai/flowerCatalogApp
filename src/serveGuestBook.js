const serveGuestBook = (response, comments, { readFile }, sourceDir) => {
  const fileName = sourceDir + '/guestbookTemplate.txt';
  const template = readFile(fileName, 'utf8');
  // const listOfComments = comments.getComments();
  // const commentsBlock = generateCommentsBlock(listOfComments);

  // response.send(template.replace('__COMMENTS__', commentsBlock));
  response.send(template.replace('__COMMENTS__', comments.toHtml()));
};

module.exports = { serveGuestBook };
