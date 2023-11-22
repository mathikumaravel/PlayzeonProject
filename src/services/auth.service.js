const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const OrganizationUsers = require('../models/organizationUsers.js');
const Organizations = require('../models/organizations.js');
const users = require('../models/users.js');
const dotenv = require('dotenv');
const { generateToken } = require('../utils/jwt.js');
const organizations = require('../models/organizations.js');

dotenv.config();
const BASE_URL = process.env.BASE_URL;
const secretKey = process.env.JWT_SECRET;
const emailCheck = async (email) => {
  const org =  await Organizations.findOne({ where: { email } });
  if (org) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return org;
}

const phoneCheck = async (phone) => {
 const existingPhone =await Organizations.findOne({ where: { phoneNumber: phone } });
  if (existingPhone) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'PhoneNumber already taken');
  }
  return existingPhone;
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
const updateOrganization= async(userId, orgId)=>{

   const orgup= await organizations.update({ created_by:userId }, {
      where: {
        id:orgId,
      },
    });
    return orgup;
}

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
        console.log('user not  found');
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
          token: token,
          refereshToken:refereshToken,
          role:userDetails.role,
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
      const refToken = jwt.sign({ userId: foundUser.dataValues.id }, secretKey, { expiresIn: '1d' },"refresh");
      const response = {
          token: token,
          refreshToken:refToken,
          role:userDetails.role,
      };
      return response;
  } catch (error) {
      console.error('Error on user:', error);
      throw error; // Rethrow the error to handle it appropriately in your controller or route handlers.
  }
};
module.exports = { register,login,refToken,emailCheck,phoneCheck,userregister,organizationUser,updateOrganization };
