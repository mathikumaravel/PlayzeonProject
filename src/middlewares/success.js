const success = (statusCode, req, res, next) => {
  try {
    res.status(statusCode).send({ success: true, req });
  } catch (error) {
    next(error);
  }
};

module.exports = success;