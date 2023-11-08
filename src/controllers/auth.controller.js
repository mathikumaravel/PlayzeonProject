const httpStatus = require('http-status');
const authService = require('../services/auth.service.js');
const ApiError = require('../utils/ApiError');
const { mail } = require('../utils/sendEmail.js');
const users = require('../models/users.js');
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
    const userCreatedorg = await authService.register(user);
    const userCreated = await authService.userregister(user);
    const orgUser = await authService.organizationUser(
      userCreatedorg.dataValues.id,
      userCreated.createdUser.dataValues.id
    );
 await mail(userCreated.createdUser.dataValues.email,'Verify Your Email',userCreated.html,res)
    

    res.status(201).json({ userCreatedorg, userCreated, orgUser , mailResponse : `mail sent to ${userCreatedorg.dataValues.email}`}); // Wrap the response in an object

  } catch (error) {
    res.status(500).json({ message: error.message }); // Set status code for errors
  }
};
const verifyUser = async (req,res) =>{
  try {
  const user = await users.findByPk(req.query.id);
  if(!user){
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot found id');
  }
  await users.update({ verified: true }, {
    where: {
      id:req.query.id,
    },
  });
  res.status(201).json({
    message: 'email verified successfully',
  });
  }
catch (error) { 
  console.log(error,"error");
    res.status(500).json({ message: error.message }); 
  }
}
const signin = async (req,res) => {
  try{
      const user = req.body;
      const response= await authService.login(user);
      res.status(200).json({response, message: "sucessesfully Login" })}
      catch (error) {
          res.status(500).json({ message: error.message }); // Set status code for errors
        }
};
const refreshToken = async (req, res) => {
  try{
    const response= await authService.refToken(req.body.referesToken);
    res.status(200).json({response, message: "access Token sucessesfully " })
    }
    catch (error) {
        res.status(500).json({ message: error.message }); // Set status code for errors
      }
};
module.exports = {
  register,
  verifyUser,
  signin,
  refreshToken
};
