const Joi = require('joi');
const { password, objectId } = require('../../../validations/custom.validation');
const { ROLES } = require('../../../config/roles');

const createUser = {
  body: Joi.object()
    .keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().custom(password),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      role: Joi.string().required().valid(ROLES),
    })
    .unknown(true),
};
const createAdminUser = {
  body: Joi.object()
    .keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().custom(password),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
    })
    .unknown(true),
};

const getUsers = {
  query: Joi.object()
    .keys({
      role: Joi.string(),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    })
    .unknown(true),
};

const getUser = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
    })
    .unknown(true),
};

const deleteUser = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const activeUser = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      active: Joi.boolean().required(),
    })
    .min(1),
};

const getUserProviderById = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const getUserProviders = {
  query: Joi.object()
    .keys({
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    })
    .unknown(true),
};

const getUserBlogs = {
  query: Joi.object()
    .keys({
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    })
    .unknown(true),
};

const getUserBlogById = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const getUserBlogCategories = {
  query: Joi.object()
    .keys({
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    })
    .unknown(true),
};

const getUserProviderBlogs = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  query: Joi.object()
    .keys({
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    })
    .unknown(true),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  activeUser,
  createAdminUser,
  getUserProviderById,
  getUserProviders,
  getUserBlogs,
  getUserBlogById,
  getUserBlogCategories,
  getUserProviderBlogs,
};
