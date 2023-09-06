const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const authService = require('./auth.service');
const userService = require('../user/user.service');
const providerService = require('../provider/provider.service');
const tokenService = require('../../../services/token.service');
const emailService = require('../../../services/email.service');
const { ROLES } = require('../../../config/roles');
const ApiError = require('../../../utils/ApiError');
const config = require('../../../config/config');
const { ObjId } = require('../../../utils/util');
const claimProfileService = require('../claimProfile/claimProfile.service');

const register = catchAsync(async (req, res) => {
  if (req.body.claimYourProfile) {
    await userService.update(ObjId(req.body.userId), req.body);
    await providerService.updateOne({ userId: ObjId(req.body.userId) }, req.body);
    await claimProfileService.update(ObjId(req.body.claimId), { profile_claimed_status: 'completed' });
    return res.status(httpStatus.CREATED).send({ message: 'User has been created' });
  }
  const user = await userService.create(req.body);
  const randomCode = tokenService.randomString(5, '#Aa');
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user, randomCode);
  await emailService.sendVerificationEmail(user, verifyEmailToken, false);
  const tokens = await tokenService.generateAuthTokens(user);
  if (req.body.role === ROLES.PROVIDER) {
    const providerBody = {
      ...req.body,
      userId: user.id,
      email: user.email,
      firstName: user.firstName || 'Unknown',
      lastName: user.lastName || '',
      userType: String(req.body.userType)
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/[^a-zA-Z _]/g, '')
        .replace(/_+/g, '_'),
    };
    await providerService.create(providerBody);
    res.status(httpStatus.CREATED).send({
      message: 'User has been created. Please verify your email before try to signin an application.',
      user,
      tokens,
    });
  } else {
    res.status(httpStatus.CREATED).send({ message: 'User has been created', user, tokens });
  }
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  if (user) {
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.OK).send({ message: 'Logging in successfully', user, tokens });
  } else {
    throw new ApiError(httpStatus.FORBIDDEN, 'User not found');
  }
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.OK).send({ message: 'Logging out successfully' });
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.status(httpStatus.OK).send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { resetPasswordToken, user } = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(user, resetPasswordToken);
  res.status(httpStatus.OK).send({ message: 'You have received an email containing the link to reset your password' });
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.OK).send({ message: 'You have successfully set a new password' });
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  try {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
    await emailService.sendVerificationEmail(req.user, verifyEmailToken);
    res.status(httpStatus.OK).send({ message: 'A link for verification has been sent to your e-mail address.' });
  } catch (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
});

const verifyEmail = catchAsync(async (req, res) => {
  req.body.code = false;
  const status = await authService.verifyEmail(req.query.token, req.query.uid, req.query.code);
  let webUrl = config.userWebEndPointURL;
  if (status && status.user && status.user.role === ROLES.ADMIN) {
    webUrl = config.adminWebEndPointURL;
  }
  if (status && status.code === 200) {
    res
      .status(httpStatus.OK)
      .send(`<p>Email verification has already been completed. To return to Home, click <a href="${webUrl}">here</a></p>`);
  } else {
    res
      .status(httpStatus.OK)
      .send(`<p>The email has been verified successfully. To return to Home, click <a href="${webUrl}">here</a></p>`);
  }
});

const changePassword = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const userId = ObjId(_id);
  await authService.changePassword(userId, req.body.password);
  res.status(httpStatus.OK).send({ message: 'You have successfully set a new password' });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  changePassword,
};
