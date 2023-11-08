
const express = require('express');
const router = express.Router();

const userController =require('../../controllers/user.controller')
router.post('/login', userController.signin);
router.post('/refresh',userController.refreshToken) 
module.exports = router;
