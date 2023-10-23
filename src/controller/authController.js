const catchAsync = require("../utils/catchAsync");
const success = require('../middlewares/success');
const ApiError = require('../utils/ApiError');
const { authService } = require("../service");
const httpStatus = require("http-status");
const signin = catchAsync(async (req, res) => {
    const response=await authService.login(req.body);
    console.log(response,"ssssssssssssssssssssssssss")
    // return res.status(200).send(response);
    return success(response, httpStatus.OK);
  });
  
  const signout = catchAsync(async (req, res) => {
    try {
      req.session = null;
      return res.status(200).send({ message: "You've been signed out!" });
    } catch (err) {
      this.next(err);
    }
  });
module.exports = {
    signin
  };