const httpStatus = require('http-status');
const tokenService = require('../../../services/token.service');
const userService = require('../user/user.service');
const { Token, User, Provider, Patient } = require('../../../models');
const ApiError = require('../../../utils/ApiError');
const { tokenTypes } = require('../../../config/tokens');
const { ROLES } = require('../../../config/roles');
const { MESSAGE } = require('../../../utils/message');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.FORBIDDEN, MESSAGE.EMAIL_PWD_INCORRECT);
  }
  if ((user.role === ROLES.PROVIDER || user.role === ROLES.PATIENT || user.role === ROLES.ADMIN) && !user.isEmailVerified) {
    throw new ApiError(httpStatus.FORBIDDEN, MESSAGE.EMAIL_NOT_VERIFIED);
  }
  if (!user.active) {
    throw new ApiError(httpStatus.FORBIDDEN, MESSAGE.USER_NOT_ACTIVE);
  }
  if (user.role === ROLES.PROVIDER) {
    const provider = await Provider.findOne({
      userId: user.id,
    });
    if (provider && !provider.active) {
      throw new ApiError(httpStatus.FORBIDDEN, MESSAGE.USER_NOT_ACTIVE);
    }
  } else if (user.role === ROLES.PATIENT) {
    const patient = await Patient.findOne({
      userId: user.id,
    });
    if (patient && !patient.active) {
      throw new ApiError(httpStatus.FORBIDDEN, MESSAGE.USER_NOT_ACTIVE);
    }
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.get(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.get(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.update(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken, userId, code = false) => {
  try {
    const getUser = await User.findById(userId);
    if (getUser && getUser.isEmailVerified) {
      return {
        code: 200,
        message: 'Email already verified',
        user: getUser,
      };
    }
    if (getUser && !getUser.isEmailVerified) {
      const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL, code);
      const user = await userService.get(verifyEmailTokenDoc.user);
      if (!user) {
        throw new Error();
      }
      await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
      await userService.update(user.id, { isEmailVerified: true });
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, `User not found`);
    }
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `Email verification failed: ${error.message}`);
  }
};

/**
 * Change password
 * @param {string} id
 * @param {string} newPassword
 * @returns {Promise}
 */
const changePassword = async (userId, newPassword) => {
  try {
    const user = await userService.get(userId);
    if (!user) {
      throw new Error();
    }
    await userService.update(user.id, { password: newPassword });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'change password failed');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  changePassword,
};
