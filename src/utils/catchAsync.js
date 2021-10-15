const { appLogger } = require('./appLogger');

const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const catchAsyncHelper = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        appLogger.error({ msg: 'Error: ', error });
        return [false, error];
    });
};

module.exports = catchAsync;
