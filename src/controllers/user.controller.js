// const  authService = require("../services/user.service");
// const jwt = require('jsonwebtoken'); 
// const signin = async (req,res) => {
//     try{
//         const user = req.body;
//         const response= await authService.login(user);
//         res.status(200).json({response, message: "sucessesfully Login" })}
//         catch (error) {
//             res.status(500).json({ message: error.message }); // Set status code for errors
//           }
//   };
//   const refreshToken = async (req, res) => {
//     try{
//       const response= await authService.refToken(req.body.referesToken);
//       res.status(200).json({response, message: "access Token sucessesfully " })
//       }
//       catch (error) {
//           res.status(500).json({ message: error.message }); // Set status code for errors
//         }
//   };
 
//   module.exports = {
//     signin,refreshToken
//   };