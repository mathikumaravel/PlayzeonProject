const express = require('express');
const router = express.Router();

const authController = require('../../controllers/auth.controller');
// const  verifyUser= require('../../controllers/verifyUser')
router.post('/register', authController.register);
router.get('/verify-email', authController.verifyUser);
module.exports = router;

