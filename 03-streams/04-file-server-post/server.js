const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      const pathNameSplit = url.pathname.split("/").filter(elem => elem !== "");
      const limitStream = new LimitSizeStream({ limit: 1e6, readableObjectMode: true })
      const outStream = fs.createWriteStream(filepath, { flags: 'wx+' });

      req
        .pipe(limitStream)
        .on('error', (err) => {
          if (err.code === 'LIMIT_EXCEEDED') {
            res.statusCode = 413;
            res.end(err.message);
          }
        })
        .pipe(outStream)
        .on('error', (err) => {
          if (pathNameSplit.length > 1) {
            res.statusCode = 400;
            res.end('Bad Request');
          } else if (err.code === 'EEXIST') {
            res.statusCode = 409;
            res.end('File With a Given Name Exists');
          } else {
            res.statusCode = 500;
            res.end('Internal Server Error');
          }
        })
        .on('finish', () => {
          res.statusCode = 201;
          res.end('File Has Been Created');
        })

      req.on('aborted', () => {
        outStream.destroy();
        fs.unlink(filepath, () => { });
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
