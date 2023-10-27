const httpStatus = require('http-status');
const db = require('../models')
const ApiError = require('../utils/ApiError');
const Organizations = require("../models/organizations.model");
const createUser = async (value) => {
  try {
    const existingUser = await Organizations.findOne({ where: { email: 'test' } });
    if (existingUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    const user = await Organizations.create({email: value.email, phoneNumber: value.phoneNumber, createdAt: value.createdAt, updatedAt: value.updatedAt});
    const userDetails = user.dataValues;
    console.log(userDetails,"userdetailssssss")
    const response = {
      id: userDetails.id,
      email: userDetails.email,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      orgName: userDetails.orgName,
      phoneNumber: userDetails.phoneNumber
    }
    return response;
  } catch (error) {
    console.error('Error creating user:', error);
  }
};
module.exports = {
  createUser
}