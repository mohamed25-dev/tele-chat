var express = require('express');
var router = express.Router();
const User = require('../models/user');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let data = await User.find({});
  res.send(data);
});

module.exports = router;
