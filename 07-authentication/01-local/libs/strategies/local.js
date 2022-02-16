const LocalStrategy = require('passport-local')
const User = require('../../models/User');

module.exports = new LocalStrategy(
  { usernameField: 'email', session: false },
  async function (email, password, done) {
    try {
      // 1. find user by email
      const user = await User.findOne({ email });
      // check if user exists
      if (!user) {
        return done(null, false, 'Нет такого пользователя');
      }
      // done(null, null, "wrong password") -> failed
      // 2. generate hash using password
      // 3. compare hash
      const isPasswordVaid = await user.checkPassword(password);
      if (!isPasswordVaid) {
        return done(null, false, 'Неверный пароль');
      }
      // done(null, user) -> success
      return done(null, user);
    } catch (err) {
      return done(err)
    }
  }
);