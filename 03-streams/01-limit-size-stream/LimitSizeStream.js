const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  #bytesCounter = 0;
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.encoding = options.encoding;
  }

  _transform(chunk, encoding, callback) {
    this.#bytesCounter += Buffer.byteLength(chunk);
    if (this.#bytesCounter > this.limit) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
