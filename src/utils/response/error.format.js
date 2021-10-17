const { APP_ID } = require('config/config');
const httpStatus = require('http-status');
const AppError = require('./AppError');

/**
 * @description Function to return formatted error object
 */
module.exports.errorFormat = ({ message, errorCode, error, statusCode, statusPhrase }) => {
    let debugMessage = error && error.message;
    let errorStack = undefined;

    // Trim error stack lines to 10
    if (error instanceof Error) {
        const { stack } = error;
        errorStack = stack && stack.split('\n').splice(0, 10).join('\n');

        if (error.errorType === 'CUSTOM') {
            message = error.message;
            errorCode = error.errorCode;
            statusCode = error.statusCode;
            debugMessage = undefined;
            error = undefined;
        }
    }

    if (process.env.NODE_ENV === 'production') {
        return {
            status: 'FAILURE',
            statusCode,
            statusPhrase,
            errorCode,
            message,
            debugMessage,
        };
    } else {
        return {
            status: 'FAILURE',
            statusCode,
            statusPhrase,
            errorCode,
            message,
            debugMessage,
            error,
            stack: errorStack,
        };
    }
};

/**
 * @description Unauthorized error
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
 * @description Required Parameter Error
 */
module.exports.createRequiredParamError = (missingKey, isFormat = false) => {
    const requiredParamError = {
        errorCode: `E_${APP_ID}_REQUIRED_PARAM_MISSING`,
        message: `Missing input parameter: '${missingKey}'`,
        statusCode: httpStatus.BAD_REQUEST,
        statusPhrase: httpStatus[httpStatus.BAD_REQUEST],
    };

    if (isFormat) {
        return requiredParamError;
    }

    return new AppError(requiredParamError);
};

/**
 * @description Invalid Parameter type error
 */
module.exports.createInvalidTypeError = (key, isFormat = false) => {
    const invalidTypeError = {
        errorCode: `E_${APP_ID}_INVALID_PARAM_TYPE`,
        message: `${key} value is not in required type`,
        statusCode: httpStatus.BAD_REQUEST,
        statusPhrase: httpStatus[httpStatus.BAD_REQUEST],
    };

    if (isFormat) {
        return invalidTypeError;
    }

    return new AppError(invalidTypeError);
};

/**
 * @description Invalid Parameter format error
 */
module.exports.createInvalidFormatError = (key, isFormat = false) => {
    const invalidFormatError = {
        errorCode: `E_${APP_ID}_INVALID_PARAM_FORMAT`,
        message: `${key} format doesn't match`,
        statusCode: httpStatus.BAD_REQUEST,
        statusPhrase: httpStatus[httpStatus.BAD_REQUEST],
    };

    if (isFormat) {
        return invalidFormatError;
    }

    return new AppError(invalidFormatError);
};

/**
 * @description Invalid Parameter value error
 */
module.exports.createInvalidValueError = (key, isFormat = false) => {
    const invalidValueError = {
        errorCode: `E_${APP_ID}_INVALID_PARAM_VALUE`,
        message: `${key} value is not among defined values`,
        statusCode: httpStatus.BAD_REQUEST,
        statusPhrase: httpStatus[httpStatus.BAD_REQUEST],
    };

    if (isFormat) {
        return invalidValueError;
    }

    return new AppError(invalidValueError);
};

/**
 * @description Duplicate value error
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
 * @description Record not found error
 */
module.exports.createRecordNotFoundError = (key, value, isFormat = false) => {
    const recordNotFoundError = {
        errorCode: `E_${APP_ID}_RECORD_NOT_FOUND`,
        message: `Invalid ${key} : ${value}`,
        statusCode: httpStatus.NOT_FOUND,
        statusPhrase: httpStatus[httpStatus.NOT_FOUND],
    };

    if (isFormat) {
        return recordNotFoundError;
    }

    return new AppError(recordNotFoundError);
};

/**
 * @description Bad request error
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
 * @description Server error
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
