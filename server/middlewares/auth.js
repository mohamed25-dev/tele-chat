const User = require('../models/user');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

exports.socket = (socket, next) => {
  if (!socket.handshake.query || !socket.handshake.query.token) {
    return next(createError(401, 'Unauthenticated'));
  }

  jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return next(createError(401, 'Unauthenticated'));
    }

    const user = await User.findById(decoded._id);

    if (!user) {
      return next(createError(401, 'Unauthenticated'));
    }

    socket.user = user;
    next();
  });
}

exports.authenticated = (req, res, next) => {
  const token = req.headers.authorization;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return next(createError(401, 'Unauthenticated'));
    }

    const user = await User.findById(decoded._id);
    if (!user) {
      return next(createError(401, 'Unauthenticated'));
    }

    req.user = user;
    next();
  });
}