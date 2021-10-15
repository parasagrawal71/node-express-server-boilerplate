const { appLogger } = require('../utils/appLogger');
const { NODE_ENV } = require('config/config');

module.exports.logIncomingRequests = (req, res, next) => {
    if (NODE_ENV !== 'test') {
        appLogger.request(req);
    }
    next();
};
