const OrganizationUsers = require('../models/organizationUsers.js');
const Organizations = require('../models/organizations.js');
const users = require('../models/users.js');

const emailCheck = async (email) => {
  return await Organizations.findOne({ where: { email } });
}
const phoneCheck = async (phone) =>{
  return await Organizations.findOne({ where: { phoneNumber:phone } });
}
const register = async (user) => {
  const orgcreatedUser = await Organizations.create(user);
  console.log(orgcreatedUser.dataValues.id,"Organizations.create(user)Organizations.create(user)")
  return orgcreatedUser ;

};

const userregister = async (user) => {
  const createdUser = await users.create(user);
  console.log(createdUser._previousDataValues.id,"useruseruseruseruser");
  return createdUser;
};
const organizationUser = async(userId, orgId) => {
  const newORG= {
    userId : userId,
    orgId: orgId
  }
  const createdOrgUser = await OrganizationUsers.create(newORG);
  return createdOrgUser;
}
module.exports = { register,emailCheck,phoneCheck,userregister,organizationUser };