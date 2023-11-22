
const express = require('express');
const router = express.Router();

const userController =require('../../controllers/user.controller')
router.get('/account',userController.account);
router.put('/organaization',userController.accountUpdate);
module.exports = router;
