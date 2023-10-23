const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const allowedMethods = catchAsync((req, res, next) => {
  // NOTE: Exclude TRACE and TRACK methods to avoid XST attacks.
  const methodsToAllow = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  if (!methodsToAllow.includes(req.method)) {
    next(new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Requested method not allowed to perform'));
  }
  req.tenantCredentials = {
    isTokenReq: true,
  };
  next();
});

module.exports = {
  allowedMethods,
};
