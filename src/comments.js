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
}

module.exports = { Comments };
