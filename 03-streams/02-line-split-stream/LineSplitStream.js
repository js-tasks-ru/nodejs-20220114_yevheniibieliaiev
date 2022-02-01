const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.encoding = options.encoding;
    this.str = "";
    this.strArray = [];
  }

  _transform(chunk, encoding, callback) {
    this.str += chunk.toString(this.encoding);

    this.str.match(os.EOL) ? (
      this.strArray = this.str.split(os.EOL),
      this.strArray.forEach((elem, idx) => {
        idx !== this.strArray.length - 1 ? this.push(elem) : (this.str = elem, this.strArray = []);
      })
    ) : null;

    callback();
  }

  _flush(callback) {
    this.push(this.str);
    this.str = "";

    callback();
  }
}

module.exports = LineSplitStream;
