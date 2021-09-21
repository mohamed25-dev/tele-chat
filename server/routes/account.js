const router = require('express').Router();
const controller = require('../controllers/accountController');
const auth = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  limits: {fileSize: 1024 * 1024},
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());

    if (mimeType && extname) {
      return cb(null, true);
    }

    cb(new Error('لا يمكن رفع هذا الملف'));
  }
});

router.post('/', [auth.authenticated, upload.single('avatar')], controller.profile);

router.post('/password', auth.authenticated, controller.password);

module.exports = router;