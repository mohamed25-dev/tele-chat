require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('./socket-handler');

const accountRouter = require('./routes/account');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');


const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//For the react app
app.use(express.static(path.join(__dirname, "..", "client", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use('/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/account', accountRouter);
app.use('/', indexRouter);

app.use((err, req, res, next) => {
  if (err.name === 'MongoError' || err.name === 'ValidationError' || err.name === 'CastError') {
    err.status = 422;
  }

  res.status(err.status || 500).json({
    message: err.message || 'حدث خطأ ماالرجاء المحاولة مرة أخرى'
  });
});


mongoose.connect(process.env.DB_URL,
  { useNewUrlParser: true },
  (err) => {
    if (err) throw err;
    console.log('DB Connected');
  }
);


module.exports = app;
