const httpStatus = require('http-status');

// CUSTOM IMPORTS
const { NODE_ENV } = require('config/config');

/**
 * Function to return succes response
 *
 */
const successResponse = ({ res, statusCode = httpStatus.OK, message, data }) => {
    const responseObj = {
        status: 'SUCCESS',
        statusCode,
        statusPhrase: httpStatus[statusCode],
        message,
        data,
    };

    if (NODE_ENV !== 'test') {
        appLogger.info({
            msg: `[RESPONSE] ${res.req.method} ${res.req.originalUrl.split('?')[0]} :`,
            info: responseObj,
            statusCode,
        });
    }

    return res.status(statusCode).json(responseObj);
};

module.exports = successResponse;
