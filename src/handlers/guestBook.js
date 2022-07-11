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

const timeStamp = () => {
  const dateString = new Date().toLocaleString();
  const [date, time] = dateString.split(',');
  return date + time;
};

class GuestBook {
  #comments;
  #sourceFile;
  #id;
  constructor(comments, sourceFile, id) {
    this.#sourceFile = sourceFile;
    this.#comments = comments;
    this.#id = id;
  }

  add(name, comment) {
    this.#id++;
    const post = { name, comment, timeStamp: timeStamp(), id: this.#id };
    this.#comments.unshift(post);
    return post;
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
