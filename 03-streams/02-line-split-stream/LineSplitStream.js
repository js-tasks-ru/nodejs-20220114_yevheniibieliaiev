const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.encoding = options.encoding;
    this.line = "";
  }

  _transform(chunk, encoding, callback) {
    const str = chunk.toString(this.encoding);
    this.line = str.split(`${os.EOL}`).filter(string => !!string);

    callback(null, this.line);
  }

  _flush(callback) {
    
    callback();
  }
}

module.exports = LineSplitStream;
