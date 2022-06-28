const EOL = '\r\n';
const pageBreak = '<br/>';

const divBlock = (divClass, body) => `<div class="${divClass}">${body}</div>`;

const parseComment = (commentsString) => {
  const comments = commentsString.split(EOL);
  return comments.join(pageBreak);
};

const formatPost = ({ author, comment, timeStamp }) => {
  const authorBlock = divBlock('author', `${author} : `);
  const commentBlock = divBlock('comment', parseComment(comment));
  const timeStampBlock = divBlock('timeStamp', timeStamp);
  const contentBlock = divBlock('content', authorBlock + commentBlock);
  return divBlock('post', timeStampBlock + contentBlock);
};

const generateCommentsBlock = (comments) => {
  const commentsHtml = [];
  const listOfComments = comments.slice(0).reverse();
  listOfComments.forEach(comment => commentsHtml.push(formatPost(comment)));
  return commentsHtml.join('');
};

class Comments {
  #comments;
  constructor(comments) {
    this.#comments = comments;
  }

  add(post) {
    this.#comments.push(post);
  };

  getComments() {
    return this.#comments.slice(0);
  }

  toHtml() {
    return generateCommentsBlock(this.getComments());
  }
}

module.exports = { Comments };
