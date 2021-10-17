const httpStatus = require('http-status');

// CUSTOM IMPORTS
const { APP_ID } = require('config/config');
const AppError = require('./AppError');

/**
 * Function to return formatted error object
 *
 */
module.exports.errorFormat = ({ message, errorCode, error, statusCode, statusPhrase }) => {
    let debugMessage = error && error.message;
    let errorStack = undefined;

    // Trim error stack lines to 10
    if (error instanceof Error) {
        const { stack } = error;
        errorStack = stack && stack.split('\n').splice(0, 10).join('\n');

        if (error instanceof AppError) {
            debugMessage = undefined;
            error = undefined;
        }
    }

    if (process.env.NODE_ENV === 'production') {
        return {
            status: 'FAILURE',
            message,
            statusCode,
            statusPhrase,
            errorCode,
            debugMessage,
        };
    } else {
        return {
            status: 'FAILURE',
            message,
            statusCode,
            statusPhrase,
            errorCode,
            debugMessage,
            error,
            stack: errorStack,
        };
    }
};

/*
 * ************************************************************************************************************************************************** //
 */

/**
 * Unauthorized error
 *
 */
module.exports.createUnauthorizedError = (isFormat = false) => {
    const unauthorizedError = {
        errorCode: `E_${APP_ID}_UNAUTHORIZED`,
        statusCode: httpStatus.UNAUTHORIZED,
        statusPhrase: httpStatus[httpStatus.UNAUTHORIZED],
    };

    if (isFormat) {
        return unauthorizedError;
    }

    return new AppError(unauthorizedError);
};

/**
 * Required Parameters Error
 *
 */
module.exports.createRequiredParamError = (missingKeys, isFormat = false) => {
    const requiredParamError = {
        errorCode: `E_${APP_ID}_REQUIRED_PARAM_MISSING`,
        message: `Missing input parameters: '${missingKeys}'`,
        statusCode: httpStatus.BAD_REQUEST,
        statusPhrase: httpStatus[httpStatus.BAD_REQUEST],
    };

    if (isFormat) {
        return requiredParamError;
    }

    return new AppError(requiredParamError);
};

/**
 * Parameters' invalid type error
 *
 */
module.exports.createInvalidTypeError = (keys, isFormat = false) => {
    const invalidTypeError = {
        errorCode: `E_${APP_ID}_INVALID_PARAM_TYPE`,
        message: `'${keys}' type is invalid`,
        statusCode: httpStatus.BAD_REQUEST,
        statusPhrase: httpStatus[httpStatus.BAD_REQUEST],
    };

    if (isFormat) {
        return invalidTypeError;
    }

    return new AppError(invalidTypeError);
};

/**
 * Parameters' invalid format error
 *
 */
module.exports.createInvalidFormatError = (keys, isFormat = false) => {
    const invalidFormatError = {
        errorCode: `E_${APP_ID}_INVALID_PARAM_FORMAT`,
        message: `'${keys}' format doesn't match`,
        statusCode: httpStatus.BAD_REQUEST,
        statusPhrase: httpStatus[httpStatus.BAD_REQUEST],
    };

    if (isFormat) {
        return invalidFormatError;
    }

    return new AppError(invalidFormatError);
};

/**
 * Parameters' invalid value error
 *
 */
module.exports.createInvalidValueError = (keys, isFormat = false) => {
    const invalidValueError = {
        errorCode: `E_${APP_ID}_INVALID_PARAM_VALUE`,
        message: `'${keys}' parameters value is not among defined values`,
        statusCode: httpStatus.BAD_REQUEST,
        statusPhrase: httpStatus[httpStatus.BAD_REQUEST],
    };

    if (isFormat) {
        return invalidValueError;
    }

    return new AppError(invalidValueError);
};

/**
 * Duplicate value error
 *
 */
module.exports.createDuplicateValueError = (key, value, isFormat = false) => {
    const duplicateValueError = {
        errorCode: `E_${APP_ID}_DUPLICATE_VALUE`,
        message: `Duplicate value found ${key} : ${value}`,
        statusCode: httpStatus.BAD_REQUEST,
        statusPhrase: httpStatus[httpStatus.BAD_REQUEST],
    };

    if (isFormat) {
        return duplicateValueError;
    }

    return new AppError(duplicateValueError);
};

/**
 * Record not found error
 *
 */
module.exports.createRecordNotFoundError = (key, value, isFormat = false) => {
    const recordNotFoundError = {
        errorCode: `E_${APP_ID}_RECORD_NOT_FOUND`,
        message: `Data not found for ${key} = ${value}`,
        statusCode: httpStatus.NOT_FOUND,
        statusPhrase: httpStatus[httpStatus.NOT_FOUND],
    };

    if (isFormat) {
        return recordNotFoundError;
    }

    return new AppError(recordNotFoundError);
};

/**
 * Bad request error
 *
 */
module.exports.createBadRequestError = (message, isFormat = false) => {
    const badRequestError = {
        errorCode: `E_${APP_ID}_BAD_REQUEST`,
        message,
        statusCode: httpStatus.BAD_REQUEST,
        statusPhrase: httpStatus[httpStatus.BAD_REQUEST],
    };

    if (isFormat) {
        return badRequestError;
    }

    return new AppError(badRequestError);
};

/**
 * Server error
 *
 */
module.exports.createServerError = (message, isFormat = false) => {
    const serverError = {
        errorCode: `E_${APP_ID}_SERVER_ERROR`,
        message,
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        statusPhrase: httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
    };

    if (isFormat) {
        return serverError;
    }

    return new AppError(serverError);
};
