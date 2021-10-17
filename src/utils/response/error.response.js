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

    if (error instanceof mongoose.Error || (error && error.name === 'MongoError')) {
        [finalStatusCode, responseObj] = handleMongoErrors(error);
    } else if (error instanceof Joi.ValidationError) {
        [finalStatusCode, responseObj] = handleJoiErrors(error);
    } else if (error instanceof AppError) {
        finalStatusCode = error.statusCode;
        responseObj = errorFormat({ ...error, error });
    } else if (error && error.code === 'ECONNREFUSED') {
        finalStatusCode = 500;
        responseObj = errorFormat({ ...createServerError('External service is unreachable', true), error });
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

/*
 * ************************************************************************************************************************************************** //
 */

/**
 * Function to handle mongo errors
 *
 */
const handleMongoErrors = (e) => {
    let responseObj = null;

    // Validation Error
    if (e instanceof mongoose.Error.ValidationError) {
        const errors = e.errors || {};

        const requiredParams = [];
        const invalidTypeParams = [];
        const invalidValueParams = [];
        const regexParams = [];
        for (const fieldName of Object.keys(errors)) {
            // Required parameters error
            if (errors[fieldName].kind === 'required') {
                requiredParams.push(fieldName);
            }

            // Invalid type errors
            if (errors[fieldName].name === 'CastError') {
                invalidTypeParams.push(fieldName);
            }

            // Enum errors
            if (errors[fieldName].kind === 'enum') {
                invalidValueParams.push(fieldName);
            }

            // Regular expression errors
            if (errors[fieldName].kind === 'regexp') {
                regexParams.push(fieldName);
            }
        }

        if (requiredParams.length) {
            responseObj = errorFormat({ ...createRequiredParamError(requiredParams.join(', '), true), error: e });
        } else if (invalidTypeParams.length) {
            responseObj = errorFormat({ ...createInvalidTypeError(invalidTypeParams.join(', '), true), error: e });
        } else if (invalidValueParams.length) {
            responseObj = errorFormat({ ...createInvalidValueError(invalidValueParams.join(', '), true), error: e });
        } else if (regexParams.length) {
            responseObj = errorFormat({ ...createInvalidFormatError(regexParams.join(', '), true), error: e });
        }
    }

    // Duplicate value Error
    else if (e.code === 11000) {
        const uniqueKey = e.keyPattern && Object.keys(e.keyPattern);
        const value = e.keyValue && e.keyValue[uniqueKey];
        responseObj = errorFormat({ ...createDuplicateValueError(uniqueKey, value, true), error: e });
    }

    // ImmutableField
    else if (e.code === 66) {
        responseObj = errorFormat({ ...createBadRequestError("Cannot modify the immutable field '_id'", true), error: e });
    }

    // If no condition matches
    else if (responseObj === null) {
        responseObj = errorFormat({ ...createBadRequestError(e.message, true), error: e });
    }

    return [httpStatus.BAD_REQUEST, responseObj];
};

/**
 * Function to handle joi errors
 *
 */
const handleJoiErrors = (e) => {
    let responseObj = e;

    responseObj = errorFormat({ ...createServerError(e.message, true), error: e });

    return [httpStatus.BAD_REQUEST, responseObj];
};

module.exports = errorResponse;
