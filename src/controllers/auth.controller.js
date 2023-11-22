const httpStatus = require('http-status');
const authService = require('../services/auth.service.js');
const ApiError = require('../utils/ApiError');
const { mail } = require('../utils/sendEmail.js');
const users = require('../models/users.js');
const organizations = require('../models/organizations.js');
const register = async (req, res) => {
  try {
    const user = req.body;
    await authService.emailCheck(user.email);
    await authService.phoneCheck(user.phoneNumber);
    const userCreatedorg = await authService.register(user);
    const userCreated = await authService.userregister(user);
    await organizations.update({ createdBy: userCreated.createdUser.dataValues.id}, {
      where: {
        id:userCreatedorg.dataValues.id,
      },
    });
    const organization = await organizations.findOne( {
      where: {
        id:userCreatedorg.dataValues.id,
      },
    });
    const orgData= organization.dataValues
    const userData= userCreated.createdUser
    const orgUser = await authService.organizationUser(
      userCreated.createdUser.dataValues.id,
      userCreatedorg.dataValues.id,
    );
    
 await mail(userCreated.createdUser.dataValues.email,'Verify Your Email',userCreated.html,res)
    
 res.status(201).json({ message: "Register successfuly", orgData, userData, orgUser , mailResponse : `mail sent to ${userCreatedorg.dataValues.email}`}); 
    // res.status(201).json({ userCreatedorg, userCreated, orgUser , mailResponse : `mail sent to ${userCreatedorg.dataValues.email}`}); 

  } catch (error) {
    res.status(500).json({ message: error.message }); // Set status code for errors
  }
};
const verifyUser = async (req,res) =>{
  
  try {
  const user = await users.findOne({ where: { id:req.query.id } })
  if(!user){
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot found id');
  }
  // if(user.dataValues.verified === false){
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'email verified already');
  // }
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
      if (response) {
        res.status(httpStatus.CREATED).send(response);
      } else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
      }
     
      // res.status(200).json({response, message: "Login Success" })
    }
      catch (error) {
          res.status(500).json({ message: error.message }); // Set status code for errors
        }
};
const refreshToken = async (req, res) => {
  try{
    const response= await authService.refToken(req.body.refreshToken);
    if (response) {
      res.status(httpStatus.CREATED).send(response);
    } 
    // res.status(200).json({response, message: "access Token sucessesfully " })
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
