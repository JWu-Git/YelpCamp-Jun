const ExpressError = require('./ExpressError');
function catchAsync(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (e) {
      return next(e);
    }
  };
}

module.exports = catchAsync;
