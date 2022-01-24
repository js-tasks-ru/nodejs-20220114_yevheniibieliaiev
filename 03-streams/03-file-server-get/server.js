const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      const stream = fs.createReadStream(filepath);
      const pathNameSplit = url.pathname.split("/").filter(elem => elem !== "");

      const body = [];
      stream
        .on('data', (chunk) => {
          body.push(chunk);
        })

        .on('end', () => {
          res.statusCode = 200;
          res.end(Buffer.concat(body));
        })

        .on('error', () => {
          if (pathNameSplit.length > 1) {
            res.statusCode = 400;
            res.end('Bad Request');
          } else if (pathNameSplit.length === 1) {
            res.statusCode = 404;
            res.end('File Does Not Exist');
          } else {
            res.statusCode = 500;
            res.end('Internal Server Error');
          }
        })

        .on('open', () => { })

        .on('close', () => { });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
