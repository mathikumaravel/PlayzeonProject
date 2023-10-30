const httpStatus = require('http-status');
const authService = require('../services/auth.service.js');
const ApiError = require('../utils/ApiError');

const register = async (req, res) => {
  try {
    const user = req.body;
    const existingEmail = await authService.emailCheck(user.email);
    if (existingEmail) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    const existingPhone = await authService.phoneCheck(user.phoneNumber);
    if (existingPhone) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'PhoneNumber already taken');
    }
    const userCreated = await authService.register(user);
    res.status(201).json(userCreated);
  } catch (error) {
    res.json({ message: error.message });
  }
};
module.exports = {
  register
};