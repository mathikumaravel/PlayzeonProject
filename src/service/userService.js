const httpStatus = require('http-status');
const Users = require('../model/userModel');
const ApiError = require('../utils/ApiError');
const createUser = async (value) => {
  try {
    if (await Users.findOne({ where: { email: value.email } })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
      const user = await Users.create(value);
      return user;
  } catch (error) {
    console.error('Error creating user:', error);
  }
  };
module.exports={
    createUser
}