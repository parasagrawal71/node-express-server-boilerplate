const mongoose = require('mongoose');
const Joi = require('joi');
const httpStatus = require('http-status');

// CUSTOM IMPORTS
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
const AppError = require('./AppError');

/**
 * Function to return error response
 *
 */
const errorResponse = ({ res, statusCode = httpStatus.INTERNAL_SERVER_ERROR, message, error }) => {
    let responseObj = null;
    let finalStatusCode = statusCode;

    if (error instanceof mongoose.Error) {
        [finalStatusCode, responseObj] = handleMongoErrors(error);
    } else if (error instanceof Joi.ValidationError) {
        [finalStatusCode, responseObj] = handleJoiErrors(error);
    } else if (error instanceof AppError) {
        finalStatusCode = error.statusCode;
        responseObj = errorFormat({ ...error, error });
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

/**
 * Function to handle mongo errors
 *
 */
const handleMongoErrors = (e) => {
    let responseObj = e;
    if (e && e.name === 'ValidationError' && e.errors && Object.keys(e.errors).length > 0) {
        responseObj = errorFormat({ ...createBadRequestError('', true), error: e }); // todo: error message
    }

    return [httpStatus.BAD_REQUEST, responseObj];
};

/**
 * Function to handle joi errors
 *
 */
const handleJoiErrors = (e) => {
    let responseObj = e;

    responseObj = errorFormat({ ...createServerError(errorMessage, true), error });

    return [httpStatus.BAD_REQUEST, responseObj];
};

module.exports = errorResponse;
