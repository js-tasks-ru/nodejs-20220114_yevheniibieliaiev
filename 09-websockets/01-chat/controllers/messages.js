const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  const { id } = ctx.user;

  const userMessages = await Message.find({ chat: id }).limit(20);

  const messagesList = userMessages.map(mapMessage);

  ctx.body = { messages: messagesList };
};
