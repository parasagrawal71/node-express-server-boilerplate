// CUSTOM IMPORTS
const pick = require('utils/pick');
const catchAsync = require('utils/catchAsync');
const { userHelper } = require('api/v1/helpers');
const { successResponse, createRecordNotFoundError } = require('utils/response');

/**
 * Controller to get users
 *
 */
module.exports.getUsers = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await userHelper.queryUsers(filter, options);

    return successResponse({ res, message: 'List of users', data: result });
});

/**
 * Controller to get a user
 *
 */
module.exports.getUser = catchAsync(async (req, res) => {
    const user = await userHelper.getUserById(req.params.userId);
    if (!user) {
        throw createRecordNotFoundError('id', req.params.userId);
    }

    return successResponse({ res, message: 'User data', data: user });
});
