const httpStatus = require("http-status");
const organizations = require("../models/organizations");
const userService = require('../services/user.service');
const ApiError = require("../utils/ApiError");
  const center = async (req,res) =>{
    try{
      await userService.accountDetails(req);
      }
    catch (error) { 
      console.log(error,"error");
      res.status(500).json({ message: error.message }); 
    }
  } 
  const centerUpdate = async (req,res) =>{
    try{
      const accountdetails=req.body;
      await userService.accountDetailsUpdate(req);
      const account = await userService.accountDetailsUpdate(req)
      const emailCheck = await organizations.findOne({ where: { email:accountdetails.email } });
      if(account.email!==accountdetails.email){
      if (emailCheck ) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exit');
      }}
        await organizations.update({
        title: accountdetails.title,
        summary: accountdetails.summary,
        suite: accountdetails.suite,
        streetAddress: accountdetails.streetAddress,
        city: accountdetails.city,
        stateProvince: accountdetails.stateProvince,
        postalCodeId: accountdetails.postalCodeId,
        zipCode: accountdetails.zipCode,
        email: accountdetails.email,
        phoneNumber: accountdetails.phoneNumber,
        updatedAt: accountdetails.updatedAt,
        role:accountdetails.role},{ where: { id: account.id } });
     res.status(httpStatus.OK).send({ message:'Updated Successfully'})
        }
  catch (error) { 
    console.log(error,"error");
      res.status(500).json({ message: error.message }); 
    }
  }
//   module.exports={account,accountUpdate}