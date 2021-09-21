const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 25
  },
  username: {
    type: String,
    required: true,
    maxlength: 25,
    unique: true
  },
  about: {
    type: String,
    required: false,
    maxlength: 120,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    maxlength: 125,
  },
  avatar: {
    type: String
  }
}, 
{
  toObject: { virtual: true },
  toJSON: { virtual: true }
});

userSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  next();
});

userSchema.methods.getData = function () {
  return {
    _id: this._id,
    name: this.name,
    username: this.username,
    about: this.about,
    avatar: this.avatar
  }
}

userSchema.methods.signJwt = function () {
  const data = this.getData();
  data.token = jwt.sign(data, process.env.JWT_SECRET);

  return data;
}

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;