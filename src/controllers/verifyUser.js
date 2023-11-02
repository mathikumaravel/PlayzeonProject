const users = require('../models/users');
const checkToken = require('../utils/jwt');
const verifyUser = async (res, next) => {
  try {

    const user = await users.findByPk(id);

    if (!user) throw CustomError('Sorry, Invalid link', 409);

    const tokenChecked = await checkToken(token);

    if (!tokenChecked) throw CustomError('Sorry, Invalid link', 409);

    await users.update({ verified: true });

    res.json({
      message: 'email verified successfully',
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(CustomError(error.message, 400));
    }
    if (error.name === 'TokenExpiredError') {
      return next(CustomError('Sorry This link was Invalid, try Again', 500));
    }
    return next(error);
  }
};

module.exports = verifyUser;