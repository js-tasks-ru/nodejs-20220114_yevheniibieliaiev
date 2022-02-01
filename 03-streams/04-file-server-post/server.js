const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Bad Request');
  }

  switch (req.method) {
    case 'POST':
      const limitStream = new LimitSizeStream({ limit: 1e6 });
      limitStream.on('error', (err) => {
        if (err.code = 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          outStream.destroy();
          limitStream.destroy();
          fs.unlink(filepath, (err) => {
            err ? console.log(err) : console.log('deleted');
          });
          res.end('Request Entity Too Large');
        } else {
          res.statusCode = 500;
          res.end('Internal Server Error');
        }

      })

      const outStream = fs.createWriteStream(filepath, { flags: 'wx+' });
      outStream.on('error', (err) => {
        if (err.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File With a Given Name Exists');
        } else {
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      });

      req.on('aborted', () => {
        outStream.destroy();
        limitStream.destroy();
        fs.unlink(filepath, () => { });
      })

      req.pipe(limitStream).pipe(outStream);

      outStream.on('finish', () => {
        res.statusCode = 201;
        res.end('File Has Been Created');
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
