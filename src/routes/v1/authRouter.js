const express = require('express');
const { userController } = require('../../controller/index');
const router = express.Router();
router.post('/register',userController.register);
module.exports = router;
