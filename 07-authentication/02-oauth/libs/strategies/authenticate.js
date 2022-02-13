const User = require('../../models/User');


module.exports = async function authenticate(strategy, email, displayName, done) {
  //1. Убедиться в том, что поле `email` передано.
  if (!email) {
    return done(null, false, 'Не указан email');
  }

  try {
    //2. Попытаться найти пользователя по переданному `email`.
    const user = await User.findOne({ email });

    //3. Если пользователь есть - аутентифицировать его (передав в коллбек стратегии `done` объект 
    //пользователя).
    if (user) {
      return done(null, user);
    } else {
      //4. Если пользователя нет - создать для него новый документ и аутентифицировать.
      const candidate = new User({ email, displayName });
      await candidate.save();

      const newUser = await User.findOne({ email });
      return done(null, newUser);
    }
  } catch (err) {
    return done(err);
  }
};
