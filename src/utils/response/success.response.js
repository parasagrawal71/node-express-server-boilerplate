const { NODE_ENV } = require('config/config');
const httpStatus = require('http-status');

const successResponse = ({ res, statusCode = 200, message, data }) => {
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
        });
    }

    return res.status(statusCode).json(responseObj);
};

module.exports = successResponse;
