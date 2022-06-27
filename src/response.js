const EOL = '\r\n';

const statusMessages = {
  200: 'OK',
  301: 'Moved Permanently',
  302: 'Found',
  404: 'Not Found',
}

class Response {
  #socket;
  #statusCode;
  #headers;
  constructor(socket) {
    this.#socket = socket;
    this.#statusCode = 200;
    this.#headers = {};
  }

  set statusCode(code) {
    this.#statusCode = code;
  }

  setHeader(key, value) {
    this.#headers[key] = value;
  }

  #writeHeaders() {
    Object.entries(this.#headers).forEach(([key, value]) =>
      this.#write(`${key} : ${value}${EOL}`));
  }
  #statusLine() {
    const statusMessage = statusMessages[this.#statusCode];
    return `HTTP/1.1 ${this.#statusCode} ${statusMessage}${EOL}`;
  }

  #write(content) {
    this.#socket.write(content);
  }

  #end() {
    this.#socket.end();
  }

  send(body) {
    this.setHeader('Content-Length', body.length);
    this.#write(this.#statusLine());
    this.#writeHeaders();
    this.#write(EOL);
    this.#write(body);
    this.#end();
  }
}

module.exports = { Response };
