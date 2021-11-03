const Joi = require('joi');

// CUSTOM IMPORTS
const validate = require('middlewares/validate');
const { isEmptyObject } = require('utils/helperFunctions');
const { createBadRequestError } = require('utils/response');

/**
 * Validation before logging in
 *
 */
const login = (req, res, next) => {
    if (!req.body || isEmptyObject(req.body)) {
        return next(createBadRequestError('Request body cannot be empty'));
    }

    next();
};

module.exports = { login };
