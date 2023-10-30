const Organizations = require('../models/organizations.model.js');

const emailCheck = async (email) => {
  return await Organizations.findOne({ where: { email } });
}
const phoneCheck = async (phone) =>{
  return await Organizations.findOne({ where: { phoneNumber:phone } });
}
const register = async (user) => {
  return await Organizations.create(user);
};

module.exports = { register,emailCheck,phoneCheck };