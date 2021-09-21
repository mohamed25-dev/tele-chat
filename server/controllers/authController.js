const createError = require('http-errors');
const User = require('../models/user');

exports.createUser = async (req, res, next) => {
  try {
    const data = { name, username, password } = req.body;
    const user = await User.create(data);

    sendNewUser(user);
    res.json(user.signJwt());
  } catch (e) {
    next(e);
  }
}

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      username
    });

    if (!user || !user.checkPassword(password)) {
      throw createError(401, 'اسم المستخدم أو كلمة المرور خاطئة');
    }

    await delay(1500);
    res.json(user.signJwt());
  } catch (e) {
    next(e);
  }
}

const sendNewUser = (user) => {
  io.emit('new_user', {
    name: user.name,
    username: user.username,
    avatar: user.avatar
  })
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))