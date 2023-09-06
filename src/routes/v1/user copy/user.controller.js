const httpStatus = require('http-status');
const { pick, omit } = require('../../../utils/util');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const userService = require('./user.service');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.create(req.body);
  res.status(httpStatus.CREATED).send(user);
});
const createAdminUser = catchAsync(async (req, res) => {
  const user = await userService.createAdminUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const filter = omit(req.query, options);
  if (filter.name) {
    filter.name = { $regex: filter.name, $options: 'i' };
  }
  const result = await userService.find(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.get(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  req.body.name = `${req.body.firstName} ${req.body.lastName}`;
  const user = await userService.update(req.params.id, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.remove(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const activeUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;
  const user = await userService.update(id, {
    active: !!active,
  });
  res.send({
    message: `User ${(!!active && 'activated') || 'deactivated'} successfully`,
    data: user,
  });
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createAdminUser,
  activeUser,
};
