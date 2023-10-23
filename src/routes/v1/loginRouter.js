// const express = require('express');
// const { userController } = require('../../controller/index');
// const router = express.Router();
// router.post('/register',userController.register);
// module.exports = router;

const express = require('express');
const { authController } = require('../../controller/index');
const router = express.Router()
router.post('/login',authController.signin);
module.exports = router;