const router = require('express').Router();

const ProductController =  require('./controller');
const multer = require('multer');
const os = require('os');

router.post('/product', multer({dest: os.tmpdir()}).single('image'), ProductController.store);
router.get('/products', ProductController.index);
module.exports = router;