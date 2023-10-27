
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {userService} = require('../service/index');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
  const response = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send({
    message:'Register successfuly',
    response
  })
});

module.exports = {
  register
};