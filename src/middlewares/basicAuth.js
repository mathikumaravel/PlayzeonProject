const httpStatus = require('http-status');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const { Tenant, User } = require('../mysql-model/sequelize/models/model');
const { USER_ROLE_ID } = require('../mysql-model/sequelize/utils/constant');
const status = require('../config/status');
const redisClient = require('../utils/redis');

const checkHeaders = (req, res, next) => {
  const authorizationHeaders = req.headers.customheader.split(' ');
  if (authorizationHeaders[0] !== 'Basic') next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized!'));
  return Buffer.from(authorizationHeaders[1], 'base64').toString().split(':');
};

const basicAuth = () => async (req, res, next) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async () => {
    try {
      // eslint-disable-next-line no-console
      const clientCredentials = checkHeaders(req, res, next);
      /**
       * Check from Redis first
       * If not in Redis => Retreive from DB and insert in Redis (With an expiry time of 30 days)
       */
      let sessionClient = JSON.parse(
        await redisClient.HGET(`TEN-CLID : ${clientCredentials[0]}`, `TEN_${clientCredentials[1]}`)
      );
      if (!sessionClient) {
        sessionClient = await Tenant.findOne({
          where: { clientId: clientCredentials[0], clientSecret: clientCredentials[1] },
          include: {
            model: User,
            where: {
              roleId: USER_ROLE_ID.TENANT,
            },
            required: true,
            attributes: ['userRefId', 'isEmailVerified', 'isMobileVerified', 'status', 'userId', 'email'],
          },
          raw: true,
          // eslint-disable-next-line no-shadow
        }).then(async (res) => {
          res.tenantUserId = res['user.userId'];
          res.tenantUserRefId = res['user.userRefId'];
          res.isEmailVerified = res['user.isEmailVerified'];
          res.tenantStatus = res['user.status'];
          res.isMobileVerified = res['user.isMobileVerified'];
          res.tenantEmail = res['user.email'];
          delete res['user.userId'];
          delete res['user.userRefId'];
          delete res['user.isEmailVerified'];
          delete res['user.isMobileVerified'];
          delete res['user.status'];
          delete res['user.email'];
          await redisClient.HSET(`TEN-CLID : ${clientCredentials[0]}`, `TEN_${clientCredentials[1]}`, JSON.stringify(res));
          await redisClient.EXPIRE(
            `TEN-CLID : ${clientCredentials[0]}`,
            config.sessionCacheExpiryDays * config.noOfSecondsInADay
          );
          return res;
        });
      }
      if (!sessionClient) {
        next(new ApiError(httpStatus.BAD_REQUEST, 'Invalid client credentials'));
      } else if (sessionClient.type !== config.mode) {
        next(new ApiError(httpStatus.BAD_REQUEST, `Invalid client credentials`));
        // eslint-disable-next-line dot-notation
      } else if (!sessionClient['isEmailVerified'] && !sessionClient['isMobileVerified']) {
        next(new ApiError(httpStatus.BAD_REQUEST, `Email or mobile verification pending`));
        // eslint-disable-next-line dot-notation
      } else if (status[Number(sessionClient['tenantStatus']) - 1] !== 'verified') {
        // eslint-disable-next-line dot-notation
        if (status[Number(sessionClient['tenantStatus']) - 1] === 'pending') {
          return next(new ApiError(httpStatus.BAD_REQUEST, `Admin verification pending`));
        }
        return next(new ApiError(httpStatus.BAD_REQUEST, `Please contact the administrator`));
      } else {
        logger.info(`database searched for ${clientCredentials[0]}`);
        req.tenantCredentials = sessionClient;
        req.verifyUserViaOTP = false;
        next();
      }
    } catch (err) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized!'));
    }
  });
};

module.exports = basicAuth;
