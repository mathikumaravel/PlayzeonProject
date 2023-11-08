const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');
const bcrypt = require('bcrypt');
const OrganizationUsers = require('../models/organizationUsers.js');
const Organizations = require('../models/organizations.js');
const users = require('../models/users.js');
const dotenv = require('dotenv');
const { generateToken } = require('../utils/jwt.js');

dotenv.config();
const BASE_URL = process.env.BASE_URL;

const emailCheck = async (email) => {
  return await Organizations.findOne({ where: { email } });
}

const phoneCheck = async (phone) => {
  return await Organizations.findOne({ where: { phoneNumber: phone } });
}

const register = async (user) => {
  const orgcreatedUser = await Organizations.create(user);
  return orgcreatedUser;
};

const userregister = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 12); // Use a higher number of rounds for stronger security
  const createdUser = await users.create({ ...user, password: hashedPassword });

  const payload = {
    id: createdUser.dataValues.id,
    email: createdUser.dataValues.email,
  };

  const token = await generateToken(payload, {
    expiresIn: '0.5h',
    algorithm: 'HS256',
  });

  const html =`<a href="${BASE_URL}/api/auth/verify-email?token=${token}&id=${createdUser.dataValues.id}">Verify Your Email</a>`;
  const response = {
    createdUser: createdUser,
    html: html
  }
  return response;
};

const organizationUser = async (userId, orgId) => {
  const newOrgUser = {
    userId: userId,
    orgId: orgId
  }
  const createdOrgUser = await OrganizationUsers.create(newOrgUser);
  return createdOrgUser;
}
const login = async (user) => { 
  try {
      const foundUser = await users.findOne({
          where: {
              email: user.email            }
      });
      if (!foundUser) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
      }
      if (foundUser.dataValues.verified === false) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Email not verified');
      }
      const passwordCheckUser = await bcrypt.compare(user.password, foundUser.dataValues.password);
      if (!passwordCheckUser) {
          throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Password');
      }

      // Create a JWT token
      const userDetails = foundUser.dataValues;
      const token = jwt.sign({ userId: foundUser.dataValues.id }, secretKey, { expiresIn: '1h' });
      const refereshToken = jwt.sign({ userId: foundUser.dataValues.id }, secretKey, { expiresIn: '1d' });
      const response = {
          id: userDetails.id,
          email: userDetails.email,
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          phoneNumber: userDetails.phoneNumber,
          token: token,
          refereshToken:refereshToken,
      };
      return response; 
  } catch (error) {
      console.error('Error on user:', error);
  }
};
const refToken = async (refreshToken) => {
  try {
      if (!refreshToken) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Unauthorized');
      }
      const decoded = jwt.verify(refreshToken, secretKey);
      const foundUser = await users.findOne({
          where: {
              id:decoded.userId         }
      });
      const userDetails = foundUser.dataValues;
      const token = jwt.sign({ userId: foundUser.dataValues.id }, secretKey, { expiresIn: '1h' },"access");
      const refereshToken = jwt.sign({ userId: foundUser.dataValues.id }, secretKey, { expiresIn: '1d' },"refresh");
      const response = {
          id: userDetails.id,
          email: userDetails.email,
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          phoneNumber: userDetails.phoneNumber,
          token: token,
          refereshToken:refereshToken,
      };
      return response;
  } catch (error) {
      console.error('Error on user:', error);
      throw error; // Rethrow the error to handle it appropriately in your controller or route handlers.
  }
};
module.exports = { register, emailCheck, phoneCheck, userregister, organizationUser,login,refToken };
