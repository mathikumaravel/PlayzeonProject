const { hash } = require('bcryptjs');
const OrganizationUsers = require('../models/organizationUsers.js');
const Organizations = require('../models/organizations.js');
const Users = require('../models/users.js');
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
  console.log(orgcreatedUser.dataValues, "Organizations.create(user)Organizations.create(user)");
  return orgcreatedUser;
};

const userregister = async (user) => {
  const hashedPassword = await hash(user.password, 12); // Use a higher number of rounds for stronger security
  const createdUser = await Users.create({ ...user, password: hashedPassword });

  const payload = {
    id: createdUser.dataValues.id,
    email: createdUser.dataValues.email,
  };

  const token = await generateToken(payload, {
    expiresIn: '0.5h',
    algorithm: 'HS256',
  });

  const html =`<a href="${BASE_URL}/api/auth/verify-email?token=${token}&id=${createdUser.dataValues.id}">Verify Your Email</a>`;
 console.log(html,"html,html");
  console.log(createdUser.dataValues.id, "useruseruseruseruser");
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
  console.log("returned org");
  return createdOrgUser;
}

module.exports = { register, emailCheck, phoneCheck, userregister, organizationUser };
