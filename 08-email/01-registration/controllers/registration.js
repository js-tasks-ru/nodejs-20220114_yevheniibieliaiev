const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');


module.exports.register = async (ctx, next) => {
  const token = uuid();
  const { email, displayName, password } = ctx.request.body;

  try {
    const candidate = new User({
      email,
      displayName,
      verificationToken: token,
    });
    await candidate.setPassword(password);
    await candidate.save();

    await sendMail({
      template: 'confirmation',
      locals: { token },
      to: email,
      subject: 'Подтвердите почту'
    });

    ctx.status = 200;
    ctx.body = { status: 'ok' };
  } catch (err) {
    throw err;
  }
};

module.exports.confirm = async (ctx, next) => {
  const { verificationToken } = ctx.request.body;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    ctx.status = 400;
    ctx.body = { error: 'Ссылка подтверждения недействительна или устарела' };
    return;
  }

  user.verificationToken = undefined;
  await user.save();

  const token = await ctx.login(user);
  ctx.body = { token };
};
