const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function (socket, next) {
    const { token } = socket.handshake.query;
    if (!token) {
      return next(new Error('anonymous sessions are not allowed'));
    }

    const session = await Session.findOne({ token }).populate('user');
    if (!session) {
      return next(new Error('wrong or expired session token'));
    }

    socket.user = session.user;

    next();
  });

  io.on('connection', function (socket) {
    const { id, displayName } = socket.user;

    socket.on('message', async (msg) => {
      try {
        await Message.create({ date: new Date(), text: msg, chat: id, user: displayName });
      } catch (err) {
        throw err
      }
    });
  });

  return io;
}

module.exports = socket;
