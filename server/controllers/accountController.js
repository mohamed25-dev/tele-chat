const createError = require('http-errors');

exports.profile = async (req, res, next) => {
  const user = req.user;

  user.name = req.body.name;
  user.about = req.body.about;
  user.avatar = req.file ? req.file.filename : user.avatar;

  try {
    const updatedUser = await user.save();
    notifyUserUpdated(updatedUser);
    
  } catch (error) {
    
  }
}

exports.password = async (req, res, next) => {
  const {password, newPassword} = req.body;

  const user = req.user;
  if (!user.checkPassword(password)) {
    return next(createError('401', 'كلمةالمرور خاطئة'));
  }

  user.password = newPassword;

  const updatedUser = await user.save();
  res.json(updatedUser);
}

const notifyUserUpdated = (user) => {
  io.emit('user_updated', user.getData());
}