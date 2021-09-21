const router = require('express').Router();
const controller = require('../controllers/authController');

router.post('/register', controller.createUser);
router.post('/', controller.login);

module.exports = router;