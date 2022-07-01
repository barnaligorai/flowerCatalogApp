const EOL = '\r\n';
const pageBreak = '<br/>';

const divBlock = (divClass, body) => `<div class="${divClass}">${body}</div>`;

const parseComment = (commentsString) => {
  const comments = commentsString.split(EOL);
  return comments.join(pageBreak);
};

const generateCommentBlock = ({ name, comment, timeStamp }) => {
  const nameBlock = divBlock('name', `${name} : `);
  const commentBlock = divBlock('comment', parseComment(comment));
  const timeStampBlock = divBlock('timeStamp', timeStamp);
  const contentBlock = divBlock('content', nameBlock + commentBlock);
  return divBlock('post', timeStampBlock + contentBlock);
};

const generateCommentsBlock = (comments) => {
  const commentsHtml = [];
  comments.forEach(comment => {
    commentsHtml.push(generateCommentBlock(comment))
  }
  );
  return commentsHtml.join('');
};

class GuestBook {
  #comments;
  #sourceFile;
  constructor(comments, sourceFile) {
    this.#sourceFile = sourceFile;
    this.#comments = comments;
  }

  add(post) {
    this.#comments.unshift(post);
  };

  getComments() {
    return this.#comments.slice(0);
  }

  toHtml() {
    return generateCommentsBlock(this.getComments());
  }

  get sourceFile() {
    return this.#sourceFile;
  }
}

module.exports = { GuestBook };
