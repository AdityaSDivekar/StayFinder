const ErrorResponse = require('../../utils/error/ErrorResponse');

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    next(new ErrorResponse('Not authorized as an admin', 401));
  }
};

module.exports = admin;
