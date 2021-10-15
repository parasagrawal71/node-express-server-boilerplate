const mongoose = require('mongoose');
const httpStatus = require('http-status');

const { NODE_ENV } = require('config/config');
const {
    errorFormat,
    createRequiredParamError,
    createInvalidTypeError,
    createInvalidFormatError,
    createInvalidValueError,
    createDuplicateValueError,
    createBadRequestError,
    createRecordNotFoundError,
    createServerError,
    createUnauthorizedError,
} = require('./error.format');

const handleMongoError = (e) => {
    let responseObj = e;
    if (e && e.name === 'ValidationError' && e.errors && Object.keys(e.errors).length > 0) {
        responseObj = errorFormat({ ...createBadRequestError('', true), error: e }); // todo: error message
    }

    return [httpStatus.BAD_REQUEST, responseObj];
};

const errorResponse = ({ res, statusCode = httpStatus.INTERNAL_SERVER_ERROR, message, error }) => {
    let responseObj = null;
    let finalStatusCode = statusCode;

    if (error.errorType === 'CUSTOM') {
        finalStatusCode = error.statusCode;
        responseObj = errorFormat({ ...error, error });
    }

    if (error instanceof mongoose.Error) {
        [finalStatusCode, responseObj] = handleMongoError(error);
    }

    if (responseObj === null) {
        const errorMessage = message || (error && error.message) || 'Something went wrong';
        responseObj = errorFormat({ ...createServerError(errorMessage, true), error });
    }

    if (NODE_ENV !== 'test') {
        appLogger.error({
            msg: `[RESPONSE] ${res.req.method} ${res.req.originalUrl.split('?')[0]} :`,
            error: responseObj,
            statusCode: finalStatusCode,
        });
    }

    return res.status(finalStatusCode).json(responseObj);
};

module.exports = errorResponse;
