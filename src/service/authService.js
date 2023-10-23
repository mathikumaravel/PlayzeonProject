// const httpStatus = require('http-status');
// const Users = require('../model/userModel');
// const ApiError = require('../utils/ApiError');
// const bcrypt = require('bcryptjs/dist/bcrypt');
// const login = async (req, res) => {
//     console.log(req, "reqqqqqqqqqqqqq");
//     console.log(res, "resssssssssss");

//     try {
//         const user = await Users.findOne({
//             where: {
//                 email: req.email,
//                 password: req.password
//             }
//         });

//         if (!user) {
//             return res.status(404).send({ message: "User Not found." });
//         }

//         const passwordIsValid = bcrypt.compareSync(
//             req.password,
//             user.password
//         );

//         if (!passwordIsValid) {
//             return res.status(401).send({ message: "Invalid Password!" });
//         }

//         // Assuming "roles" is associated via a JOIN in your model, you may need to fetch it separately.
//         // Example:
//         // const roles = await user.getRoles(); // Assuming a method like this exists in your model.

//         // Rest of your code

//         res.status(200).send({
//             id: user.id,
//             email: user.email,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             orgName: user.orgName,
//             phoneNumber: user.phoneNumber,
//             // role: roles, // Add the roles if you fetched them
//             token: token
//         });
//     } catch (error) {
//         console.error('Error user on user:', error);
//     }
// };

// module.exports = {
//     login
// }
const httpStatus = require('http-status');
const Users = require('../model/userModel');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');
const login = async (req, res) => {
    console.log(req, "reqqqqqqqqqqqqq");
    console.log(res, "resssssssssss");

    try {
        const user = await Users.findOne({
            where: {
                email: req.email,
                password: req.password
            }
        });

        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        var passwordCheck = false;
        if (req.password === user.password) {
            passwordCheck = true;
        }
        // Check the password using bcrypt
        if (!passwordCheck) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Password');
        }

    
        // Create a JWT token
        const userDetails= user.dataValues;
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
        const response = {
            id: userDetails.id,
                    email: userDetails.email,
                    firstName: userDetails.firstName,
                    lastName: userDetails.lastName,
                    orgName: userDetails.orgName,
                    phoneNumber: userDetails.phoneNumber,
                    // role: roles, // Add the roles if you fetched them
                    token: token
        }
        return response;

    //    return res.status(200).send({
    //         id: userDetails.id,
    //         email: userDetails.email,
    //         firstName: userDetails.firstName,
    //         lastName: userDetails.lastName,
    //         orgName: userDetails.orgName,
    //         phoneNumber: userDetails.phoneNumber,
    //         // role: roles, // Add the roles if you fetched them
    //         token: token
    //     });
    } catch (error) {
        console.error('Error user on user:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

module.exports = {
    login
};
