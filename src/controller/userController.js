
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {userService} = require('../service/index');
const success = require('../middlewares/success');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
     await userService.createUser(req.body);
     success(res, httpStatus.CREATED, {
        message: `Register Successfully`,
      })
});

module.exports = {
  register
};