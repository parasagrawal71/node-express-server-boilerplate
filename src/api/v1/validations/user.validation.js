const Joi = require('joi');

// CUSTOM IMPORTS
const validate = require('middlewares/validate');
const { isEmptyObject } = require('utils/helperFunctions');
const { createBadRequestError } = require('utils/response');
const { objectId } = require('validations/custom.validation');
const UserModel = require('../models/user.model');

/**
 * Validation before creating user
 *
 */
const createUser = (req, res, next) => {
    if (!req.body || isEmptyObject(req.body)) {
        return next(createBadRequestError('Request body cannot be empty'));
    }

    const validatedModel = UserModel(req.body).validateSync();
    if (validatedModel instanceof Error) {
        return next(validatedModel);
    }

    next();
};

/**
 * Validation before getting user list
 *
 */
const getUsers = (req, res, next) => {
    validate({
        query: Joi.object().keys({
            name: Joi.string(),
            role: Joi.string(),
            sortBy: Joi.string(),
            limit: Joi.number().integer(),
            page: Joi.number().integer(),
        }),
    })(req, res, next);
};

/**
 * Validation before getting user data
 *
 */
const getUser = (req, res, next) => {
    validate({
        params: Joi.object().keys({
            userId: Joi.string().custom(objectId),
        }),
    })(req, res, next);
};

/**
 * Validation before updating user
 *
 */
const updateUser = (req, res, next) => {
    if (!req.body || isEmptyObject(req.body)) {
        return next(createBadRequestError('Request body cannot be empty'));
    }

    // // TODO: This validation not working as expected
    // const validatedModel = UserModel(req.body).validateSync();
    // if (validatedModel instanceof Error) {
    //     return next(validatedModel);
    // }

    validate({
        params: Joi.object().keys({
            userId: Joi.required().custom(objectId),
        }),
    })(req, res, next);
};

/**
 * Validation before deleting user
 *
 */
const deleteUser = (req, res, next) => {
    validate({
        params: Joi.object().keys({
            userId: Joi.string().custom(objectId),
        }),
    })(req, res, next);
};

module.exports = { createUser, getUsers, getUser, updateUser, deleteUser };
