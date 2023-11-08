const httpStatus = require('http-status');
const users = require('../models/users');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');
const bcrypt = require('bcrypt')
const login = async (user) => { // Add 'res' as a parameter
    console.log(user.password, "reqqqqqqqqqqqqq");
    try {
        const foundUser = await users.findOne({
            where: {
                email: user.email            }
        });
        console.log(foundUser, "foundUserfoundUserfoundUser");

        if (!foundUser) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
        }
        if (foundUser.dataValues.verified === false) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email not verified');
        }
        console.log(foundUser.dataValues.password,"foundUserfoundUser");
        const passwordCheckUser = await bcrypt.compare(user.password, foundUser.dataValues.password);
        
        console.log(passwordCheckUser,"passwordVerifypasswordVerifypasswordVerify");
        if (!passwordCheckUser) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Password');
        }

        // Create a JWT token
        const userDetails = foundUser.dataValues;
        console.log(userDetails,"userDetails")
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
        console.log(refreshToken,"refreshToken");
        if (!refreshToken) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Unauthorized');
        }
        const decoded = jwt.verify(refreshToken, secretKey);
        console.log(decoded,"decoded");
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

module.exports = {
    login,refToken
};
