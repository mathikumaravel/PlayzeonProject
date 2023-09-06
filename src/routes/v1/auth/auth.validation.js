const Joi = require('joi');
const { password, objectId } = require('../../../validations/custom.validation');

const register = {
  body: Joi.object()
    .keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().custom(password),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      role: Joi.string(),
      userType: Joi.string(),
    })
    .unknown(true),
};

const login = {
  body: Joi.object()
    .keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    })
    .unknown(true),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
    uid: Joi.string().required(),
    code: Joi.string(),
  }),
};

const changePassword = {
  body: Joi.object()
    .keys({
      password: Joi.string().required().custom(password),
    })
    .unknown(true),
  user: Joi.object().keys({
    _id: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  changePassword,
};
