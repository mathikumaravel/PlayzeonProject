const httpStatus = require("http-status");
const organizations = require("../models/organizations");
const jwt = require('jsonwebtoken');
const ApiError = require("../utils/ApiError");
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.JWT_SECRET;

const  accountDetails = async (req) => {
  try {
   
    const accountToken=req.headers.token;
    const decoded = jwt.verify(accountToken, secretKey);
    const accountuser= await organizations.findOne({ where: { id:decoded.userId } });
    const account= accountuser.dataValues;
    if (!accountuser) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
    }
      const response = {
        id: account.id,
        title: account.title,
        summary: account.summary,
        suite: account.suite,
        streetAddress: account.streetAddress,
        city: account.city,
        stateProvince: account.stateProvince,
        postalCodeId: account.postalCodeId,
        zipCode: account.zipCode,
        email: account.email,
        phoneNumber: account.phoneNumber,
        createdBy:account.createdBy,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
        role:account.role,
        };
    return response;
} catch (error) {
    console.error('Error on user:', error);
}
}
const  accountDetailsUpdate = async (req) => {
  try {
    const accountToken=req.headers.token;
    const decoded = jwt.verify(accountToken, secretKey);
    const accountdata= await organizations.findOne({ where: { id:decoded.userId } });
    if (!accountdata) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
    }
    if (accountdata) {
    const account= accountdata.dataValues;
    return account;
  }
  return accountdata;
} catch (error) {
    console.error('Error on user:', error);
}
}

module.exports = {
  accountDetails,accountDetailsUpdate
};
