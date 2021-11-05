const Joi = require('joi');

// CUSTOM IMPORTS
const validate = require('middlewares/validate');
const { isEmptyObject } = require('utils/helperFunctions');
const { createBadRequestError, createRequiredParamError } = require('utils/response');

/**
 * Validation before register
 *
 */
const register = (req, res, next) => {
    if (!req.body || isEmptyObject(req.body)) {
        return next(createBadRequestError('Request body cannot be empty'));
    }

    const { password, name } = req.body;
    if (!name) {
        return next(createRequiredParamError(`name`));
    }

    if (!password) {
        return next(createRequiredParamError(`password`));
    }

    next();
};

/**
 * Validation before logging in
 *
 */
const login = (req, res, next) => {
    if (!req.query || isEmptyObject(req.query)) {
        return next(createBadRequestError('Request query parameters cannot be empty')); // todo:
    }

    next();
};

/**
 * Validation before account verification
 *
 */
const accountVerification = (req, res, next) => {
    next();
};
/**
 * Validation before resending verification email
 *
 */
const resendVerificationEmail = (req, res, next) => {
    next();
};

/**
 * Validation before google login
 *
 */
const googleLogin = (req, res, next) => {
    next();
};

/**
 * Validation before setting password
 *
 */
const setPassword = (req, res, next) => {
    next();
};

/**
 * Validation before handling forgot password
 *
 */
const handleForgotPassword = (req, res, next) => {
    next();
};

/**
 * Validation before verfifying email address
 *
 */
const verifyEmailAddress = (req, res, next) => {
    next();
};

module.exports = { register, login, resendVerificationEmail, accountVerification, googleLogin, setPassword, handleForgotPassword, verifyEmailAddress };
